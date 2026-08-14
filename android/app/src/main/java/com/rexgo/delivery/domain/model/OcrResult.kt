package com.rexgo.delivery.domain.model

data class OcrResult(
    val primaryPhoneNumber: String,
    val normalizedPhoneNumber: String,
    val confidence: Float,
    val fullRawText: String,
    val candidates: List<PhoneNumberCandidate> = emptyList(),
    val matchedLabel: String? = null,
    val scanTimestamp: Long = System.currentTimeMillis()
)
