package com.rexgo.delivery.permission

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat

/**
 * Supported permissions for RexGo delivery workflow.
 */
sealed class AppPermission(val manifestPermissions: List<String>, val labelMyanmar: String, val labelEnglish: String) {
    data object Camera : AppPermission(
        manifestPermissions = listOf(Manifest.permission.CAMERA),
        labelMyanmar = "ကင်မရာ အသုံးပြုခွင့်",
        labelEnglish = "Camera Access"
    )

    data object Location : AppPermission(
        manifestPermissions = listOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        ),
        labelMyanmar = "တည်နေရာ အသုံးပြုခွင့်",
        labelEnglish = "Location Access"
    )

    data object Notification : AppPermission(
        manifestPermissions = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            listOf(Manifest.permission.POST_NOTIFICATIONS)
        } else {
            emptyList()
        },
        labelMyanmar = "အသိပေးချက် ရယူခွင့်",
        labelEnglish = "Notification Access"
    )

    data object MediaImages : AppPermission(
        manifestPermissions = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            listOf(Manifest.permission.READ_MEDIA_IMAGES, Manifest.permission.READ_MEDIA_VISUAL_USER_SELECTED)
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            listOf(Manifest.permission.READ_MEDIA_IMAGES)
        } else {
            listOf(Manifest.permission.READ_EXTERNAL_STORAGE)
        },
        labelMyanmar = "ဓာတ်ပုံ / မီဒီယာ အသုံးပြုခွင့်",
        labelEnglish = "Photos / Media Access"
    )
}

/**
 * Modular Permission Manager Architecture
 * Note: Permissions are NOT actively requested at runtime during Phase 1.
 */
class PermissionManager(private val context: Context) {

    fun isPermissionGranted(permission: AppPermission): Boolean {
        if (permission.manifestPermissions.isEmpty()) return true
        return permission.manifestPermissions.all { perm ->
            ContextCompat.checkSelfPermission(context, perm) == PackageManager.PERMISSION_GRANTED
        }
    }

    fun getPermissionStatusList(): Map<String, Boolean> {
        val permissions = listOf(
            AppPermission.Camera,
            AppPermission.Location,
            AppPermission.Notification,
            AppPermission.MediaImages
        )
        return permissions.associate { it.labelEnglish to isPermissionGranted(it) }
    }
}
