package com.rexgo.delivery.domain.repository

import com.rexgo.delivery.domain.model.UserSession
import kotlinx.coroutines.flow.Flow

/**
 * Authentication & Session Repository Interface (Clean Architecture Domain Layer)
 * Note: Real online authentication / Supabase is strictly decoupled and omitted in Phase 1.
 */
interface AuthRepository {
    val sessionFlow: Flow<UserSession>
    
    suspend fun loginLocally(employeeId: String, rememberMe: Boolean): Result<Unit>
    suspend fun logout(): Result<Unit>
    suspend fun getRememberedEmployeeId(): String
}
