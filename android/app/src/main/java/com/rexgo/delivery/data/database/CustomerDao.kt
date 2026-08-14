package com.rexgo.delivery.data.database

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface CustomerDao {

    @Query("SELECT * FROM customers ORDER BY updatedAt DESC")
    fun getAllCustomers(): Flow<List<CustomerEntity>>

    @Query("SELECT * FROM customers WHERE id = :id LIMIT 1")
    suspend fun getCustomerById(id: String): CustomerEntity?

    @Query("SELECT * FROM customers WHERE normalizedPhone = :normalizedPhone LIMIT 1")
    suspend fun findCustomerByPhone(normalizedPhone: String): CustomerEntity?

    @Query("""
        SELECT * FROM customers 
        WHERE name LIKE '%' || :query || '%' 
           OR normalizedPhone LIKE '%' || :query || '%' 
           OR address LIKE '%' || :query || '%' 
           OR township LIKE '%' || :query || '%'
        ORDER BY deliveryCount DESC
    """)
    fun searchCustomers(query: String): Flow<List<CustomerEntity>>

    @Insert(onConflict = OnConflictStrategy.ABORT)
    suspend fun insertCustomer(customer: CustomerEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateCustomer(customer: CustomerEntity)

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertAll(customers: List<CustomerEntity>): List<Long>

    @Update
    suspend fun updateCustomer(customer: CustomerEntity)

    @Delete
    suspend fun deleteCustomer(customer: CustomerEntity)

    @Query("DELETE FROM customers WHERE id = :id")
    suspend fun deleteCustomerById(id: String)

    @Query("UPDATE customers SET deliveryCount = deliveryCount + 1, lastDeliveredAt = :timestamp WHERE id = :id")
    suspend fun incrementDeliveryCount(id: String, timestamp: Long = System.currentTimeMillis())
}
