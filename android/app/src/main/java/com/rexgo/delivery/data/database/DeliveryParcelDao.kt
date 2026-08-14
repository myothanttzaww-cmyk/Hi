package com.rexgo.delivery.data.database

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface DeliveryParcelDao {

    @Query("SELECT * FROM delivery_parcels ORDER BY createdAt ASC")
    fun getAllTodayParcels(): Flow<List<DeliveryParcelEntity>>

    @Query("SELECT * FROM delivery_parcels WHERE status = :status ORDER BY createdAt ASC")
    fun getParcelsByStatus(status: String): Flow<List<DeliveryParcelEntity>>

    @Query("SELECT * FROM delivery_parcels WHERE id = :id LIMIT 1")
    suspend fun getParcelById(id: String): DeliveryParcelEntity?

    @Query("SELECT * FROM delivery_parcels WHERE trackingNo = :trackingNo LIMIT 1")
    suspend fun findParcelByTrackingNo(trackingNo: String): DeliveryParcelEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertParcel(parcel: DeliveryParcelEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertParcels(parcels: List<DeliveryParcelEntity>)

    @Update
    suspend fun updateParcel(parcel: DeliveryParcelEntity)

    @Query("UPDATE delivery_parcels SET status = :status, completedAt = :completedAt WHERE id = :id")
    suspend fun updateStatus(id: String, status: String, completedAt: Long? = null)

    @Delete
    suspend fun deleteParcel(parcel: DeliveryParcelEntity)

    @Query("DELETE FROM delivery_parcels")
    suspend fun clearAllParcels()
}
