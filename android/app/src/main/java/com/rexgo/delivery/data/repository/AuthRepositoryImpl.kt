package com.rexgo.delivery.data.repository

import com.rexgo.delivery.data.session.SessionManager
import com.rexgo.delivery.domain.model.UserSession
import com.rexgo.delivery.domain.repository.AuthRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Implementation of AuthRepository
 * Manages local session persistence and preparation for Phase 2 backend auth integration.
 */
@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val sessionManager: SessionManager
) : AuthRepository {

    override val sessionFlow: Flow<UserSession> = sessionManager.userSessionFlow

    override suspend fun loginLocally(employeeId: String, rememberMe: Boolean): Result<Unit> {
        return try {
            if (employeeId.isBlank()) {
                Result.failure(IllegalArgumentException("Employee ID cannot be empty"))
            } else {
                sessionManager.saveSession(employeeId.trim(), rememberMe)
                Result.success(Unit)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun logout(): Result<Unit> {
        return try {
            sessionManager.logout()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getRememberedEmployeeId(): String {
        return try {
            val session = sessionManager.userSessionFlow.first()
            if (session.isRememberMe) session.employeeId else ""
        } catch (e: Exception) {
            ""
        }
    }
}
