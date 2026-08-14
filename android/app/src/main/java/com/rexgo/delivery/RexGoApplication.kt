package com.rexgo.delivery

import android.app.Application
import com.rexgo.delivery.data.storage.LocalStorageManager
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject

/**
 * RexGo Native Android Application Entry Point
 * Configured with Hilt Dependency Injection.
 *
 * Powered by Myo Thant Zaw
 */
@HiltAndroidApp
class RexGoApplication : Application() {

    @Inject
    lateinit var localStorageManager: LocalStorageManager

    override fun onCreate() {
        super.onCreate()
        // Initialize RexGo Scoped Storage folder structure on first launch
        localStorageManager.initializeDirectories()
    }
}
