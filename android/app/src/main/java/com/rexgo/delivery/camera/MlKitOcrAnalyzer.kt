package com.rexgo.delivery.camera

import android.graphics.Rect
import androidx.annotation.OptIn
import androidx.camera.core.ExperimentalGetImage
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.Text
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import com.rexgo.delivery.domain.model.OcrResult
import com.rexgo.delivery.domain.scanner.AutoCaptureAnalyzer
import com.rexgo.delivery.domain.scanner.PhoneNormalizer

class MlKitOcrAnalyzer(
    private val scanBoxRatio: Float = 0.80f, // 80% screen width scan box
    private val autoCaptureAnalyzer: AutoCaptureAnalyzer? = null,
    private val onPhoneDetected: (OcrResult) -> Unit,
    private val onScanningStateUpdate: (isScanning: Boolean, sharpness: Double) -> Unit
) : ImageAnalysis.Analyzer {

    // Offline Google ML Kit on-device recognizer (Latin + Numerics)
    private val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
    private var isBusy = false

    @OptIn(ExperimentalGetImage::class)
    override fun analyze(imageProxy: ImageProxy) {
        val mediaImage = imageProxy.image
        if (mediaImage == null || isBusy) {
            imageProxy.close()
            return
        }

        // Measure frame stability / sharpness
        val sharpness = autoCaptureAnalyzer?.analyzeFrame(imageProxy) ?: 100.0
        onScanningStateUpdate(true, sharpness)

        isBusy = true
        val rotation = imageProxy.imageInfo.rotationDegrees
        val inputImage = InputImage.fromMediaImage(mediaImage, rotation)

        recognizer.process(inputImage)
            .addOnSuccessListener { visionText ->
                processExtractedText(visionText, imageProxy.width, imageProxy.height)
            }
            .addOnFailureListener {
                // Silent failover for live feed continuity
            }
            .addOnCompleteListener {
                isBusy = false
                imageProxy.close()
            }
    }

    private fun processExtractedText(visionText: Text, frameWidth: Int, frameHeight: Int) {
        val fullTextBuilder = StringBuilder()

        // Calculate Central Scan Box Bounds in frame coordinate space
        val scanBoxWidth = frameWidth * scanBoxRatio
        val scanBoxHeight = scanBoxWidth * 0.65f
        val left = (frameWidth - scanBoxWidth) / 2
        val top = (frameHeight - scanBoxHeight) / 2
        val scanBoxBounds = Rect(
            left.toInt(),
            top.toInt(),
            (left + scanBoxWidth).toInt(),
            (top + scanBoxHeight).toInt()
        )

        // Filter text blocks situated inside or intersecting the scan box
        val relevantBlocks = visionText.textBlocks.filter { block ->
            block.boundingBox?.let { box ->
                Rect.intersects(box, scanBoxBounds) || scanBoxBounds.contains(box)
            } ?: true
        }

        for (block in relevantBlocks) {
            fullTextBuilder.append(block.text).append("\n")
        }

        val fullText = fullTextBuilder.toString()
        if (fullText.isNotBlank()) {
            val candidates = PhoneNormalizer.extractCandidates(fullText)
            if (candidates.isNotEmpty()) {
                val primary = candidates.first()
                val result = OcrResult(
                    primaryPhoneNumber = primary.rawNumber,
                    normalizedPhoneNumber = primary.normalizedNumber,
                    confidence = primary.confidence,
                    fullRawText = fullText,
                    candidates = candidates,
                    matchedLabel = primary.matchedLabel
                )
                onPhoneDetected(result)
            }
        }
    }

    fun close() {
        recognizer.close()
    }
}
