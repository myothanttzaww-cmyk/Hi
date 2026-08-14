package com.rexgo.delivery.ui.screens.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.rexgo.delivery.domain.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeDashboardUiState(
    val employeeId: String = "",
    val todaysParcelsCount: String = "0",
    val completedCount: String = "0",
    val remainingCount: String = "0",
    val connectionStatus: String = "Local Mode (Active)",
    val isOnline: Boolean = true,
    val totalCustomers: String = "--",
    val todaysScanCount: String = "0",
    val isRefreshing: Boolean = false
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeDashboardUiState())
    val uiState: StateFlow<HomeDashboardUiState> = _uiState.asStateFlow()

    init {
        loadSessionData()
    }

    private fun loadSessionData() {
        viewModelScope.launch {
            authRepository.sessionFlow.collect { session ->
                _uiState.update {
                    it.copy(
                        employeeId = session.employeeId.ifBlank { "Rider #101" }
                    )
                }
            }
        }
    }

    fun refreshDashboard() {
        // UI Refresh trigger without fake customer logic
        _uiState.update { it.copy(isRefreshing = true) }
        viewModelScope.launch {
            kotlinx.coroutines.delay(500)
            _uiState.update { it.copy(isRefreshing = false) }
        }
    }
}
