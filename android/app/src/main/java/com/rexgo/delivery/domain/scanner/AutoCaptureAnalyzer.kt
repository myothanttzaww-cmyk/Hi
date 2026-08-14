package com.rexgo.delivery.domain.scanner

import androidx.camera.core.ImageProxy
import java.nio.ByteBuffer

class AutoCaptureAnalyzer(
    private val sharpnessThreshold: Double = 120.0,
    private val consecutiveSharpFramesRequired: Int = 3,
    private val onAutoCaptureReady: () -> Unit
) {
    private var sharpFrameCounter = 0
    private var isTriggered = false

    fun reset() {
        sharpFrameCounter = 0
        isTriggered = false
    }

    /**
     * Analyzes YUV_420_888 Y-plane luminance buffer for sharpness and contrast variance.
     */
    fun analyzeFrame(image: ImageProxy): Double {
        if (isTriggered) return 0.0

        val plane = image.planes[0]
        val buffer = plane.buffer
        val score = calculateLuminanceVariance(buffer, image.width, image.height, plane.rowStride)

        if (score >= sharpnessThreshold) {
            sharpFrameCounter++
            if (sharpFrameCounter >= consecutiveSharpFramesRequired) {
                isTriggered = true
                onAutoCaptureReady()
            }
        } else {
            sharpFrameCounter = maxOf(0, sharpFrameCounter - 1)
        }

        return score
    }

    private fun calculateLuminanceVariance(
        buffer: ByteBuffer,
        width: Int,
        height: Int,
        rowStride: Int
    ): Double {
        // Sample central 50% region for performance optimization on Snapdragon 8s Gen 4
        val startX = width / 4
        val endX = width * 3 / 4
        val startY = height / 4
        val endY = height * 3 / 4

        var sum = 0.0
        var sumSq = 0.0
        var count = 0

        // Step by 4 for lightweight high-speed 120Hz analysis
        for (y in startY until endY step 4) {
            for (x in startX until endX step 4) {
                val index = y * rowStride + x
                if (index < buffer.limit()) {
                    val pixel = buffer.get(index).toInt() and 0xFF
                    sum += pixel
                    sumSq += (pixel * pixel)
                    count++
                }
            }
        }

        if (count == 0) return 0.0
        val mean = sum / count
        return (sumSq / count) - (mean * mean)
    }
}
