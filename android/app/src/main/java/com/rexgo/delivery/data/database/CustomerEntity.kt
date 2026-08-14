package com.rexgo.delivery.data.database

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

/**
 * Customer Table Entity in RexGo Room Database
 * Stores Customer details with indexed normalizedPhone for fast O(1) lookup.
 * Phone number is optional; id is the primary key.
 */
@Entity(
    tableName = "customers",
    indices = [
        Index(value = ["normalizedPhone"], unique = true),
        Index(value = ["name"]),
        Index(value = ["township"])
    ]
)
data class CustomerEntity(
    @PrimaryKey val id: String,
    val name: String,
    val phone: String? = null,
    val normalizedPhone: String? = null,
    val address: String,
    val township: String,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val note: String? = null,
    val deliveryCount: Int = 0,
    val lastDeliveredAt: Long? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
