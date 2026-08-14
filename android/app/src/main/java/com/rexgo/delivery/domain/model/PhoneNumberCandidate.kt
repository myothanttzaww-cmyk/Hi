package com.rexgo.delivery.domain.model

data class PhoneNumberCandidate(
    val rawNumber: String,
    val normalizedNumber: String,
    val matchedLabel: String? = null,
    val confidence: Float,
    val isPriority: Boolean = false,
    val lineIndex: Int = -1
)
