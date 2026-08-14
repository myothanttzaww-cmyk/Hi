package com.rexgo.delivery.ui.screens.scanner

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.rexgo.delivery.camera.FlashState
import com.rexgo.delivery.domain.model.OcrResult
import com.rexgo.delivery.domain.model.PhoneNumberCandidate
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ScannerUiState(
    val hasCameraPermission: Boolean = false,
    val isPermissionRequested: Boolean = false,
    val flashState: FlashState = FlashState.OFF,
    val zoomRatio: Float = 1.0f,
    val exposureIndex: Int = 0,
    val isAutoCaptureEnabled: Boolean = true,
    val isScanning: Boolean = true,
    val sharpnessScore: Double = 0.0,
    val isFocusing: Boolean = false,
    val detectedResult: OcrResult? = null,
    val selectedCandidate: PhoneNumberCandidate? = null,
    val isCapturing: Boolean = false,
    val capturedImagePath: String? = null
)

@HiltViewModel
class ScannerViewModel @Inject constructor() : ViewModel() {

    private val _uiState = MutableStateFlow(ScannerUiState())
    val uiState: StateFlow<ScannerUiState> = _uiState.asStateFlow()

    fun updatePermissionStatus(isGranted: Boolean) {
        _uiState.value = _uiState.value.copy(
            hasCameraPermission = isGranted,
            isPermissionRequested = true
        )
    }

    fun toggleFlash() {
        val nextState = when (_uiState.value.flashState) {
            FlashState.OFF -> FlashState.ON
            FlashState.ON -> FlashState.AUTO
            FlashState.AUTO -> FlashState.OFF
        }
        _uiState.value = _uiState.value.copy(flashState = nextState)
    }

    fun setZoom(zoom: Float) {
        _uiState.value = _uiState.value.copy(zoomRatio = zoom.coerceIn(1.0f, 5.0f))
    }

    fun setExposure(exposure: Int) {
        _uiState.value = _uiState.value.copy(exposureIndex = exposure.coerceIn(-2, 2))
    }

    fun toggleAutoCapture() {
        _uiState.value = _uiState.value.copy(isAutoCaptureEnabled = !_uiState.value.isAutoCaptureEnabled)
    }

    fun onScanningStateUpdate(isScanning: Boolean, sharpness: Double) {
        _uiState.value = _uiState.value.copy(
            isScanning = isScanning,
            sharpnessScore = sharpness
        )
    }

    fun onPhoneDetected(ocrResult: OcrResult) {
        if (_uiState.value.detectedResult == null) {
            _uiState.value = _uiState.value.copy(
                detectedResult = ocrResult,
                selectedCandidate = ocrResult.candidates.firstOrNull()
            )
        }
    }

    fun selectCandidate(candidate: PhoneNumberCandidate) {
        _uiState.value = _uiState.value.copy(selectedCandidate = candidate)
    }

    fun updateManualPhoneNumber(newNumber: String) {
        val current = _uiState.value.detectedResult ?: return
        val updated = current.copy(
            primaryPhoneNumber = newNumber,
            normalizedPhoneNumber = newNumber
        )
        _uiState.value = _uiState.value.copy(detectedResult = updated)
    }

    fun resetScan() {
        _uiState.value = _uiState.value.copy(
            detectedResult = null,
            selectedCandidate = null,
            isCapturing = false,
            capturedImagePath = null
        )
    }
}
