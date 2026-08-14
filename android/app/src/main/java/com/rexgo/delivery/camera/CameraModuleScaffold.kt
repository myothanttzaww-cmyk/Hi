package com.rexgo.delivery.camera

import android.content.Context

/**
 * CameraX Architecture Scaffold for RexGo
 * 
 * Strict Phase 1 Constraints:
 * - Camera is NOT opened.
 * - Camera permission is NOT requested.
 * - OCR / ML Kit / Gemini are NOT executed.
 * - Camera UI is NOT rendered.
 * 
 * This class establishes the architectural foundation ready for Phase 2 CameraX integration.
 */
class CameraModuleScaffold(private val context: Context) {
    
    companion object {
        const val MODULE_NAME = "RexGoCameraXModule"
        const val TARGET_RESOLUTION_WIDTH = 1920
        const val TARGET_RESOLUTION_HEIGHT = 1080
    }

    /**
     * Inspects if Camera hardware is available on the device.
     */
    fun hasCameraHardware(): Boolean {
        return context.packageManager.hasSystemFeature(android.content.pm.PackageManager.FEATURE_CAMERA_ANY)
    }

    /**
     * Phase 2 Ready Hook: Will initialize ProcessCameraProvider in Phase 2
     */
    fun getModuleStatus(): CameraArchitectureStatus {
        return CameraArchitectureStatus(
            isConfigured = true,
            isHardwareAvailable = hasCameraHardware(),
            phase = "Phase 1 - Scaffold Ready (Hardware inactive)"
        )
    }
}

data class CameraArchitectureStatus(
    val isConfigured: Boolean,
    val isHardwareAvailable: Boolean,
    val phase: String
)
