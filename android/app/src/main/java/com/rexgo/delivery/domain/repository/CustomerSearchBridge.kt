package com.rexgo.delivery.domain.repository

import com.rexgo.delivery.domain.model.OcrResult

/**
 * Clean architectural bridge for Phase 3 Customer Database Lookup.
 * Allows passing normalized OCR results directly to local SQLite/Room query engine in upcoming phases.
 */
interface CustomerSearchBridge {
    suspend fun lookupCustomerByPhone(phoneNumber: String): CustomerLookupResult
    suspend fun queueScannedParcel(ocrResult: OcrResult): Boolean
}

sealed class CustomerLookupResult {
    data class Found(
        val customerId: String,
        val customerName: String,
        val deliveryAddress: String,
        val township: String,
        val deliveryCount: Int
    ) : CustomerLookupResult()

    data object NotFound : CustomerLookupResult()
    data class Error(val message: String) : CustomerLookupResult()
}
