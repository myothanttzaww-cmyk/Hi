package com.rexgo.delivery.domain.model

/**
 * Domain model representing the local user session.
 */
data class UserSession(
    val employeeId: String = "",
    val isRememberMe: Boolean = false,
    val isLoggedIn: Boolean = false,
    val lastLoginTimestamp: String = ""
)
