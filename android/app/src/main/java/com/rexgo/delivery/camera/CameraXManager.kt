package com.rexgo.delivery.camera

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.graphics.Rect
import android.util.Log
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import java.io.File
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCancellableCoroutine

enum class FlashState {
    OFF,
    ON,
    AUTO
}

class CameraXManager(
    private val context: Context
) {
    private val TAG = "RexGoCameraX"

    private var cameraProvider: ProcessCameraProvider? = null
    private var camera: Camera? = null
    private var preview: Preview? = null
    private var imageCapture: ImageCapture? = null
    private var imageAnalysis: ImageAnalysis? = null
    private var cameraExecutor: ExecutorService = Executors.newSingleThreadExecutor()

    private var currentFlashState: FlashState = FlashState.OFF
    private var currentZoomRatio: Float = 1.0f

    suspend fun initializeCamera(
        lifecycleOwner: LifecycleOwner,
        previewView: PreviewView,
        analyzer: ImageAnalysis.Analyzer
    ): Boolean = suspendCancellableCoroutine { continuation ->
        val cameraProviderFuture = ProcessCameraProvider.getInstance(context)
        cameraProviderFuture.addListener({
            try {
                cameraProvider = cameraProviderFuture.get()

                // 1. Preview UseCase
                preview = Preview.Builder()
                    .setTargetAspectRatio(AspectRatio.RATIO_16_9)
                    .build()
                    .also {
                        it.setSurfaceProvider(previewView.surfaceProvider)
                    }

                // 2. ImageCapture UseCase (High Quality)
                imageCapture = ImageCapture.Builder()
                    .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
                    .setTargetAspectRatio(AspectRatio.RATIO_16_9)
                    .setFlashMode(ImageCapture.FLASH_MODE_OFF)
                    .build()

                // 3. ImageAnalysis UseCase (Backpressure strategy: KEEP_ONLY_LATEST)
                imageAnalysis = ImageAnalysis.Builder()
                    .setTargetAspectRatio(AspectRatio.RATIO_16_9)
                    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                    .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_YUV_420_888)
                    .build()
                    .also {
                        it.setAnalyzer(cameraExecutor, analyzer)
                    }

                // 4. Back Camera as Default
                val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

                // Unbind previous before rebinding
                cameraProvider?.unbindAll()

                // Bind to Lifecycle
                camera = cameraProvider?.bindToLifecycle(
                    lifecycleOwner,
                    cameraSelector,
                    preview,
                    imageCapture,
                    imageAnalysis
                )

                // Enable Auto Focus by default
                camera?.cameraControl?.cancelFocusAndMetering()

                continuation.resume(true)
            } catch (e: Exception) {
                Log.e(TAG, "Camera initialization failed: ${e.message}", e)
                continuation.resume(false)
            }
        }, ContextCompat.getMainExecutor(context))
    }

    /**
     * Touch-to-Focus support on tap coordinates
     */
    fun focusOnPoint(previewView: PreviewView, x: Float, y: Float) {
        val factory = previewView.meteringPointFactory
        val point = factory.createPoint(x, y)
        val action = FocusMeteringAction.Builder(point, FocusMeteringAction.FLAG_AF or FocusMeteringAction.FLAG_AE)
            .setAutoCancelDuration(3, java.util.concurrent.TimeUnit.SECONDS)
            .build()
        camera?.cameraControl?.startFocusAndMetering(action)
    }

    /**
     * Set Flash Mode (OFF, ON, AUTO / Torch)
     */
    fun setFlashMode(flashState: FlashState) {
        currentFlashState = flashState
        when (flashState) {
            FlashState.OFF -> {
                imageCapture?.flashMode = ImageCapture.FLASH_MODE_OFF
                camera?.cameraControl?.enableTorch(false)
            }
            FlashState.ON -> {
                imageCapture?.flashMode = ImageCapture.FLASH_MODE_ON
                camera?.cameraControl?.enableTorch(true)
            }
            FlashState.AUTO -> {
                imageCapture?.flashMode = ImageCapture.FLASH_MODE_AUTO
                camera?.cameraControl?.enableTorch(false)
            }
        }
    }

    /**
     * Zoom Control: Pinch to Zoom and Slider Zoom (1.0x - 5.0x)
     */
    fun setZoomRatio(ratio: Float) {
        val minZoom = camera?.cameraInfo?.zoomState?.value?.minZoomRatio ?: 1.0f
        val maxZoom = camera?.cameraInfo?.zoomState?.value?.maxZoomRatio ?: 5.0f
        val clamped = ratio.coerceIn(minZoom, maxZoom)
        currentZoomRatio = clamped
        camera?.cameraControl?.setZoomRatio(clamped)
    }

    fun setLinearZoom(linear: Float) {
        camera?.cameraControl?.setLinearZoom(linear.coerceIn(0f, 1f))
    }

    /**
     * Exposure Control index (-2 EV to +2 EV)
     */
    fun setExposureIndex(index: Int) {
        camera?.cameraControl?.setExposureCompensationIndex(index)
    }

    /**
     * Capture Still Photo with Scan Box Cropping for Waybill OCR Proof
     */
    fun capturePhoto(
        outputFile: File,
        scanBoxRectNorm: Rect, // Normalized scan box region (0..100)
        onSuccess: (File) -> Unit,
        onError: (Exception) -> Unit
    ) {
        val options = ImageCapture.OutputFileOptions.Builder(outputFile).build()

        imageCapture?.takePicture(
            options,
            ContextCompat.getMainExecutor(context),
            object : ImageCapture.OnImageSavedCallback {
                override fun onImageSaved(outputFileResults: ImageCapture.OutputFileResults) {
                    try {
                        // Crop Image to Scan Box Region
                        cropImageToScanBox(outputFile, scanBoxRectNorm)
                        onSuccess(outputFile)
                    } catch (e: Exception) {
                        onSuccess(outputFile) // Fallback to raw file if crop fails
                    }
                }

                override fun onError(exception: ImageCaptureException) {
                    onError(exception)
                }
            }
        )
    }

    private fun cropImageToScanBox(file: File, scanBoxRectNorm: Rect) {
        val bitmap = BitmapFactory.decodeFile(file.absolutePath) ?: return
        val cropX = (bitmap.width * (scanBoxRectNorm.left / 100f)).toInt().coerceIn(0, bitmap.width - 1)
        val cropY = (bitmap.height * (scanBoxRectNorm.top / 100f)).toInt().coerceIn(0, bitmap.height - 1)
        val cropWidth = (bitmap.width * (scanBoxRectNorm.width() / 100f)).toInt().coerceIn(1, bitmap.width - cropX)
        val cropHeight = (bitmap.height * (scanBoxRectNorm.height() / 100f)).toInt().coerceIn(1, bitmap.height - cropY)

        val croppedBitmap = Bitmap.createBitmap(bitmap, cropX, cropY, cropWidth, cropHeight)
        file.outputStream().use { out ->
            croppedBitmap.compress(Bitmap.CompressFormat.JPEG, 92, out)
        }
        bitmap.recycle()
        croppedBitmap.recycle()
    }

    /**
     * Release all camera resources on Exit
     */
    fun release() {
        try {
            cameraProvider?.unbindAll()
            if (!cameraExecutor.isShutdown) {
                cameraExecutor.shutdown()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error releasing CameraX resources: ${e.message}")
        }
    }
}
