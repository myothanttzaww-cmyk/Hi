package com.rexgo.delivery.data.storage

import android.content.Context
import android.os.Environment
import android.util.Log
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.File
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Local Storage Manager
 * Creates and manages RexGo folder hierarchy inside Scoped Storage (Public Downloads or App-specific external storage)
 * without requiring dangerous legacy MANAGE_EXTERNAL_STORAGE permissions.
 *
 * Folder Structure:
 * Downloads/
 * └── RexGo/
 *     ├── Customers/
 *     ├── Photos/
 *     ├── Today's Scan/
 *     ├── Today's Delivery/
 *     ├── Backup/
 *     ├── Import/
 *     └── Reports/
 */
@Singleton
class LocalStorageManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    companion object {
        private const val TAG = "LocalStorageManager"
        const val ROOT_DIR_NAME = "RexGo"
        
        val SUBDIRECTORIES = listOf(
            "Customers",
            "Photos",
            "Today's Scan",
            "Today's Delivery",
            "Backup",
            "Import",
            "Reports"
        )
    }

    /**
     * Initializes directory architecture on first startup.
     */
    fun initializeDirectories(): StorageInitResult {
        return try {
            val rootDir = getRexGoRootDirectory()
            if (!rootDir.exists()) {
                rootDir.mkdirs()
            }

            val createdFolders = mutableListOf<String>()
            SUBDIRECTORIES.forEach { subDirName ->
                val subDir = File(rootDir, subDirName)
                if (!subDir.exists()) {
                    val created = subDir.mkdirs()
                    if (created) createdFolders.add(subDirName)
                } else {
                    createdFolders.add(subDirName)
                }
            }

            Log.i(TAG, "RexGo directory structure verified at: ${rootDir.absolutePath}")
            StorageInitResult.Success(
                rootPath = rootDir.absolutePath,
                directories = SUBDIRECTORIES
            )
        } catch (e: Exception) {
            Log.e(TAG, "Error initializing directory structure", e)
            StorageInitResult.Error(e.message ?: "Failed to initialize directories")
        }
    }

    fun getRexGoRootDirectory(): File {
        // Standard Android Public Downloads folder
        val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
        return if (downloadsDir != null && downloadsDir.exists()) {
            File(downloadsDir, ROOT_DIR_NAME)
        } else {
            // Fallback to app-specific external files dir
            File(context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), ROOT_DIR_NAME)
        }
    }

    fun getSubdirectory(name: String): File {
        val root = getRexGoRootDirectory()
        val dir = File(root, name)
        if (!dir.exists()) {
            dir.mkdirs()
        }
        return dir
    }
}

sealed class StorageInitResult {
    data class Success(val rootPath: String, val directories: List<String>) : StorageInitResult()
    data class Error(val message: String) : StorageInitResult()
}
