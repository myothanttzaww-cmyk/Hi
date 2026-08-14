package com.rexgo.delivery.data.database

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

/**
 * Delivery Parcel Table Entity in RexGo Room Database
 * Represents a package scheduled for delivery today.
 */
@Entity(
    tableName = "delivery_parcels",
    foreignKeys = [
        ForeignKey(
            entity = CustomerEntity::class,
            parentColumns = ["id"],
            childColumns = ["customerId"],
            onDelete = ForeignKey.SET_NULL
        )
    ],
    indices = [
        Index(value = ["trackingNo"], unique = true),
        Index(value = ["customerId"]),
        Index(value = ["status"])
    ]
)
data class DeliveryParcelEntity(
    @PrimaryKey val id: String,
    val trackingNo: String,
    val customerId: String?,
    val customerName: String,
    val phone: String? = null,
    val normalizedPhone: String? = null,
    val address: String,
    val township: String,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val codAmount: Double = 0.0,
    val note: String? = null,
    val status: String = "Pending", // Pending, Completed, Skipped
    val createdAt: Long = System.currentTimeMillis(),
    val completedAt: Long? = null
)
