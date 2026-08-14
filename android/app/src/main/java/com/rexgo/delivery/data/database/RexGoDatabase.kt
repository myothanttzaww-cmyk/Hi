package com.rexgo.delivery.data.database

import androidx.room.Database
import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.RoomDatabase

/**
 * Metadata table for database initialization and sync timestamps.
 */
@Entity(tableName = "app_meta")
data class AppMetaEntity(
    @PrimaryKey val key: String,
    val value: String,
    val updatedAt: Long
)

/**
 * RexGo Room Database - Clean Architecture Data Layer
 * Handles persistent offline-first storage for Customers and Delivery Parcels.
 */
@Database(
    entities = [
        AppMetaEntity::class,
        CustomerEntity::class,
        DeliveryParcelEntity::class
    ],
    version = 2,
    exportSchema = false
)
abstract class RexGoDatabase : RoomDatabase() {
    
    abstract fun customerDao(): CustomerDao
    abstract fun deliveryParcelDao(): DeliveryParcelDao

    companion object {
        const val DATABASE_NAME = "rexgo_database.db"
    }
}

