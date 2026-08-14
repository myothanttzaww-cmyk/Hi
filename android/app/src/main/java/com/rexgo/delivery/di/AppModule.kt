package com.rexgo.delivery.di

import android.content.Context
import com.rexgo.delivery.camera.CameraXManager
import com.rexgo.delivery.data.storage.LocalStorageManager
import com.rexgo.delivery.permission.PermissionManager
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun providePermissionManager(
        @ApplicationContext context: Context
    ): PermissionManager {
        return PermissionManager(context)
    }

    @Provides
    @Singleton
    fun provideLocalStorageManager(
        @ApplicationContext context: Context
    ): LocalStorageManager {
        return LocalStorageManager(context)
    }

    @Provides
    @Singleton
    fun provideCameraXManager(
        @ApplicationContext context: Context
    ): CameraXManager {
        return CameraXManager(context)
    }
}
