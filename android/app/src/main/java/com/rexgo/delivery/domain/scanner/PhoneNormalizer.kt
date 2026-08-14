package com.rexgo.delivery.domain.scanner

import com.rexgo.delivery.domain.model.PhoneNumberCandidate
import java.util.regex.Pattern

object PhoneNormalizer {

    // Priority recipient labels as required
    val PRIORITY_LABELS = listOf(
        "To", "Receiver", "Phone", "Ph", "Ph.", "Tel", "Contact", "Mobile", "Recipient",
        "လက်ခံသူ", "ဖုန်း", "ဖုန်းနံပါတ်", "ဆက်သွယ်ရန်"
    )

    // Myanmar digits mapping to English digits
    private val MYANMAR_TO_ENGLISH_DIGITS = mapOf(
        '၀' to '0', '၁' to '1', '၂' to '2', '၃' to '3', '၄' to '4',
        '၅' to '5', '၆' to '6', '၇' to '7', '၈' to '8', '၉' to '9'
    )

    // Common OCR character substitution errors in numeric segments
    private val OCR_CHAR_SUBS = mapOf(
        'O' to '0', 'o' to '0',
        'I' to '1', 'l' to '1', '|' to '1', 'i' to '1',
        'Z' to '2', 'z' to '2',
        'S' to '5', 's' to '5',
        'G' to '6',
        'B' to '8'
    )

    /**
     * Converts Myanmar digits and common OCR misrecognized alphabets into clean numeric characters.
     */
    fun normalizeText(input: String): String {
        val sb = StringBuilder()
        for (ch in input) {
            when {
                MYANMAR_TO_ENGLISH_DIGITS.containsKey(ch) -> sb.append(MYANMAR_TO_ENGLISH_DIGITS[ch])
                OCR_CHAR_SUBS.containsKey(ch) -> sb.append(OCR_CHAR_SUBS[ch])
                else -> sb.append(ch)
            }
        }
        return sb.toString()
    }

    /**
     * Clean phone number into standard Myanmar format (e.g. 09xxxxxxxxx)
     */
    fun cleanPhoneNumber(raw: String): String {
        var normalized = normalizeText(raw)
        // Remove spaces, hyphens, parentheses, colons, slashes
        val digitsOnly = normalized.replace(Regex("[^0-9+]"), "")

        return when {
            digitsOnly.startsWith("+959") -> "09" + digitsOnly.substring(4)
            digitsOnly.startsWith("+9509") -> "09" + digitsOnly.substring(5)
            digitsOnly.startsWith("959") -> "09" + digitsOnly.substring(3)
            digitsOnly.startsWith("9509") -> "09" + digitsOnly.substring(4)
            digitsOnly.startsWith("09") -> digitsOnly
            digitsOnly.startsWith("9") && digitsOnly.length in 8..10 -> "0$digitsOnly"
            else -> digitsOnly
        }
    }

    /**
     * Validates if string represents a valid Myanmar phone number format
     */
    fun isValidMyanmarPhoneNumber(number: String): Boolean {
        val cleaned = cleanPhoneNumber(number)
        // Myanmar mobile numbers start with 09 and usually have 9 to 11 digits
        return cleaned.startsWith("09") && cleaned.length in 9..11
    }

    /**
     * Extracts and prioritizes phone numbers from multi-line OCR text
     */
    fun extractCandidates(fullText: String): List<PhoneNumberCandidate> {
        val lines = fullText.lines()
        val candidates = mutableListOf<PhoneNumberCandidate>()

        // 1. Line-by-line inspection with label matching
        lines.forEachIndexed { index, line ->
            val normalizedLine = normalizeText(line)

            for (label in PRIORITY_LABELS) {
                val labelPattern = Pattern.compile("(?i)\\b${Pattern.quote(label)}[:\\s-]*([+0-9oOlIsZbzg\\-\\s]{7,18})")
                val matcher = labelPattern.matcher(line)
                if (matcher.find()) {
                    val rawMatch = matcher.group(1)?.trim() ?: ""
                    val cleaned = cleanPhoneNumber(rawMatch)
                    if (isValidMyanmarPhoneNumber(cleaned)) {
                        candidates.add(
                            PhoneNumberCandidate(
                                rawNumber = rawMatch,
                                normalizedNumber = cleaned,
                                matchedLabel = label,
                                confidence = 0.95f,
                                isPriority = true,
                                lineIndex = index
                            )
                        )
                    }
                }
            }

            // General phone number pattern search on each line
            val generalPattern = Pattern.compile("(?:\\+?95\\s?9|09)[0-9\\-\\s]{6,12}")
            val generalMatcher = generalPattern.matcher(normalizedLine)
            while (generalMatcher.find()) {
                val rawMatch = generalMatcher.group()
                val cleaned = cleanPhoneNumber(rawMatch)
                if (isValidMyanmarPhoneNumber(cleaned) && candidates.none { it.normalizedNumber == cleaned }) {
                    candidates.add(
                        PhoneNumberCandidate(
                            rawNumber = rawMatch,
                            normalizedNumber = cleaned,
                            matchedLabel = null,
                            confidence = 0.85f,
                            isPriority = false,
                            lineIndex = index
                        )
                    )
                }
            }
        }

        // Return sorted by priority (Label matched first, then validity and occurrence)
        return candidates.sortedWith(
            compareByDescending<PhoneNumberCandidate> { it.isPriority }
                .thenByDescending { it.confidence }
        )
    }
}
