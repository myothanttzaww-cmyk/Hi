package com.rexgo.delivery.di

import android.content.Context
import androidx.room.Room
import com.rexgo.delivery.data.database.RexGoDatabase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideRexGoDatabase(
        @ApplicationContext context: Context
    ): RexGoDatabase {
        return Room.databaseBuilder(
            context,
            RexGoDatabase::class.java,
            RexGoDatabase.DATABASE_NAME
        )
        .fallbackToDestructiveMigration()
        .build()
    }
}
