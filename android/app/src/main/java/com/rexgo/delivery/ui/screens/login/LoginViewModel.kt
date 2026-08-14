package com.rexgo.delivery.ui.screens.login

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

data class LoginUiState(
    val employeeId: String = "",
    val password: String = "",
    val isRememberMe: Boolean = false,
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val isLoginSuccess: Boolean = false,
    val showForgotDialog: Boolean = false
)

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    init {
        loadRememberedSession()
    }

    private fun loadRememberedSession() {
        viewModelScope.launch {
            val rememberedId = authRepository.getRememberedEmployeeId()
            if (rememberedId.isNotBlank()) {
                _uiState.update {
                    it.copy(
                        employeeId = rememberedId,
                        isRememberMe = true
                    )
                }
            }
        }
    }

    fun onEmployeeIdChanged(id: String) {
        _uiState.update { it.copy(employeeId = id, errorMessage = null) }
    }

    fun onPasswordChanged(pass: String) {
        _uiState.update { it.copy(password = pass, errorMessage = null) }
    }

    fun onRememberMeChanged(checked: Boolean) {
        _uiState.update { it.copy(isRememberMe = checked) }
    }

    fun onForgotPasswordClicked() {
        _uiState.update { it.copy(showForgotDialog = true) }
    }

    fun onDismissForgotDialog() {
        _uiState.update { it.copy(showForgotDialog = false) }
    }

    fun login() {
        val currentState = _uiState.value
        if (currentState.employeeId.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Employee ID ထည့်သွင်းပေးပါ") }
            return
        }
        if (currentState.password.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Password ထည့်သွင်းပေးပါ") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            
            // Local Session Login Architecture (No online auth in Phase 1)
            val result = authRepository.loginLocally(
                employeeId = currentState.employeeId,
                rememberMe = currentState.isRememberMe
            )

            result.fold(
                onSuccess = {
                    _uiState.update { it.copy(isLoading = false, isLoginSuccess = true) }
                },
                onFailure = { error ->
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            errorMessage = error.localizedMessage ?: "Login failed"
                        )
                    }
                }
            )
        }
    }
}
