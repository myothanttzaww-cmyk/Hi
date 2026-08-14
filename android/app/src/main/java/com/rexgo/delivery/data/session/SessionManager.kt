package com.rexgo.delivery.data.session

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.rexgo.delivery.domain.model.UserSession
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "rexgo_session_prefs")

/**
 * SessionManager using Jetpack DataStore Preferences
 * Handles local session persistence, Remember Me state, and logout.
 */
@Singleton
class SessionManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    companion object {
        private val KEY_EMPLOYEE_ID = stringPreferencesKey("key_employee_id")
        private val KEY_IS_REMEMBER_ME = booleanPreferencesKey("key_is_remember_me")
        private val KEY_IS_LOGGED_IN = booleanPreferencesKey("key_is_logged_in")
        private val KEY_LAST_LOGIN_TIMESTAMP = stringPreferencesKey("key_last_login_timestamp")
    }

    val userSessionFlow: Flow<UserSession> = context.dataStore.data
        .catch { exception ->
            if (exception is IOException) {
                emit(emptyPreferences())
            } else {
                throw exception
            }
        }
        .map { preferences ->
            val employeeId = preferences[KEY_EMPLOYEE_ID] ?: ""
            val isRememberMe = preferences[KEY_IS_REMEMBER_ME] ?: false
            val isLoggedIn = preferences[KEY_IS_LOGGED_IN] ?: false
            val lastLoginTimestamp = preferences[KEY_LAST_LOGIN_TIMESTAMP] ?: ""
            UserSession(
                employeeId = employeeId,
                isRememberMe = isRememberMe,
                isLoggedIn = isLoggedIn,
                lastLoginTimestamp = lastLoginTimestamp
            )
        }

    /**
     * Saves user session to local DataStore.
     */
    suspend fun saveSession(employeeId: String, rememberMe: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[KEY_EMPLOYEE_ID] = if (rememberMe) employeeId else ""
            preferences[KEY_IS_REMEMBER_ME] = rememberMe
            preferences[KEY_IS_LOGGED_IN] = true
            preferences[KEY_LAST_LOGIN_TIMESTAMP] = System.currentTimeMillis().toString()
        }
    }

    /**
     * Clears active login session, keeping employee ID only if Remember Me is checked.
     */
    suspend fun clearSession(keepRememberedId: Boolean = true) {
        context.dataStore.edit { preferences ->
            val rememberMe = preferences[KEY_IS_REMEMBER_ME] ?: false
            val savedEmployeeId = preferences[KEY_EMPLOYEE_ID] ?: ""
            preferences[KEY_IS_LOGGED_IN] = false
            if (!keepRememberedId || !rememberMe) {
                preferences[KEY_EMPLOYEE_ID] = ""
                preferences[KEY_IS_REMEMBER_ME] = false
            }
        }
    }

    /**
     * Full logout support.
     */
    suspend fun logout() {
        clearSession(keepRememberedId = true)
    }
}
