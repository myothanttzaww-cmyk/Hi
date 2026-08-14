package com.rexgo.delivery.ui.screens.scanner

import android.Manifest
import android.content.Intent
import android.net.Uri
import android.provider.Settings
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.view.PreviewView
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.hilt.navigation.compose.hiltViewModel
import com.rexgo.delivery.camera.CameraXManager
import com.rexgo.delivery.camera.FlashState
import com.rexgo.delivery.camera.MlKitOcrAnalyzer
import com.rexgo.delivery.domain.model.OcrResult
import com.rexgo.delivery.domain.scanner.AutoCaptureAnalyzer
import kotlinx.coroutines.launch
import java.io.File

@Composable
fun ScannerScreen(
    viewModel: ScannerViewModel = hiltViewModel(),
    onNavigateBack: () -> Unit,
    onOcrResultReady: (OcrResult) -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val uiState by viewModel.uiState.collectAsState()
    val scope = rememberCoroutineScope()

    val cameraXManager = remember { CameraXManager(context) }
    var previewViewRef by remember { mutableStateOf<PreviewView?>(null) }
    var touchFocusPoint by remember { mutableStateOf<Offset?>(null) }

    // Laser Animation for Scan Line
    val infiniteTransition = rememberInfiniteTransition(label = "Laser")
    val laserPosition by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1800, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "LaserPosition"
    )

    // Permission Launcher (Requested on screen entry only)
    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        viewModel.updatePermissionStatus(isGranted)
    }

    LaunchedEffect(Unit) {
        permissionLauncher.launch(Manifest.permission.CAMERA)
    }

    // Auto navigate when OCR detects phone number
    LaunchedEffect(uiState.detectedResult) {
        uiState.detectedResult?.let { result ->
            onOcrResultReady(result)
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            cameraXManager.release()
        }
    }

    if (!uiState.hasCameraPermission && uiState.isPermissionRequested) {
        // Permission Denied View (Myanmar Unicode)
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFF0F1115))
                .padding(24.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.VideocamOff,
                    contentDescription = "Camera Permission Required",
                    tint = Color(0xFFFF5252),
                    modifier = Modifier.size(56.dp)
                )

                Text(
                    text = "Camera Permission လိုအပ်ပါသည်",
                    color = Color.White,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center
                )

                Text(
                    text = "ပါဆယ်ပေါ်ရှိ ဖုန်းနံပါတ်များကို Scan ဖတ်နိုင်ရန် Camera အသုံးပြုခွင့် ပေးရန် လိုအပ်ပါသည်။",
                    color = Color(0xFF94A3B8),
                    fontSize = 13.sp,
                    textAlign = TextAlign.Center,
                    lineHeight = 20.sp
                )

                Spacer(modifier = Modifier.height(8.dp))

                Button(
                    onClick = {
                        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                            data = Uri.fromParts("package", context.packageName, null)
                        }
                        context.startActivity(intent)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00E5FF)),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                ) {
                    Text(
                        text = "Open Settings (ဖွင့်ရန်)",
                        color = Color.Black,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                }

                TextButton(onClick = onNavigateBack) {
                    Text(text = "နောက်သို့ (Back)", color = Color(0xFF64748B))
                }
            }
        }
        return
    }

    // Full-screen Native CameraX Scanner View
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        // 1. Native CameraX PreviewView
        AndroidView(
            factory = { ctx ->
                PreviewView(ctx).apply {
                    implementationMode = PreviewView.ImplementationMode.PERFORMANCE
                    scaleType = PreviewView.ScaleType.FILL_CENTER
                    previewViewRef = this

                    val autoAnalyzer = AutoCaptureAnalyzer(
                        sharpnessThreshold = 110.0,
                        consecutiveSharpFramesRequired = 3,
                        onAutoCaptureReady = {
                            if (uiState.isAutoCaptureEnabled && uiState.detectedResult == null) {
                                val photoFile = File(ctx.cacheDir, "rexgo_scan_${System.currentTimeMillis()}.jpg")
                                cameraXManager.capturePhoto(
                                    outputFile = photoFile,
                                    scanBoxRectNorm = android.graphics.Rect(10, 25, 90, 65),
                                    onSuccess = {},
                                    onError = {}
                                )
                            }
                        }
                    )

                    val ocrAnalyzer = MlKitOcrAnalyzer(
                        scanBoxRatio = 0.80f,
                        autoCaptureAnalyzer = autoAnalyzer,
                        onPhoneDetected = { result ->
                            viewModel.onPhoneDetected(result)
                        },
                        onScanningStateUpdate = { isScanning, sharpness ->
                            viewModel.onScanningStateUpdate(isScanning, sharpness)
                        }
                    )

                    scope.launch {
                        cameraXManager.initializeCamera(
                            lifecycleOwner = lifecycleOwner,
                            previewView = this@apply,
                            analyzer = ocrAnalyzer
                        )
                    }
                }
            },
            modifier = Modifier
                .fillMaxSize()
                .pointerInput(Unit) {
                    detectTapGestures { offset ->
                        touchFocusPoint = offset
                        previewViewRef?.let { pv ->
                            cameraXManager.focusOnPoint(pv, offset.x, offset.y)
                        }
                    }
                }
        )

        // 2. Dark Mask Overlay with Central Transparent 80% Scan Box Hole
        Canvas(modifier = Modifier.fillMaxSize()) {
            val scanWidth = size.width * 0.80f
            val scanHeight = scanWidth * 0.65f
            val left = (size.width - scanWidth) / 2
            val top = (size.height - scanHeight) / 2

            // Dark semi-transparent background
            drawRect(
                color = Color.Black.copy(alpha = 0.65f),
                size = size
            )

            // Punch hole in the center for the Scan Box
            drawRect(
                color = Color.Transparent,
                topLeft = Offset(left, top),
                size = Size(scanWidth, scanHeight),
                blendMode = BlendMode.Clear
            )
        }

        // 3. Scan Box Guides & Animated Laser Line
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth(0.88f)
                    .aspectRatio(1.5f)
                    .border(1.5.dp, Color(0xFF00E5FF).copy(alpha = 0.6f), RoundedCornerShape(16.dp))
                    .clip(RoundedCornerShape(16.dp))
            ) {
                // Animated Laser Line
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(2.5.dp)
                        .offset(y = (laserPosition * 180).dp)
                        .background(Color(0xFF00E5FF))
                )

                // Scanner Corner Brackets
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(4.dp)
                ) {
                    // Top-Left Corner
                    Box(modifier = Modifier.align(Alignment.TopStart).size(18.dp, 3.dp).background(Color(0xFF00E5FF)))
                    Box(modifier = Modifier.align(Alignment.TopStart).size(3.dp, 18.dp).background(Color(0xFF00E5FF)))

                    // Top-Right Corner
                    Box(modifier = Modifier.align(Alignment.TopEnd).size(18.dp, 3.dp).background(Color(0xFF00E5FF)))
                    Box(modifier = Modifier.align(Alignment.TopEnd).size(3.dp, 18.dp).background(Color(0xFF00E5FF)))

                    // Bottom-Left Corner
                    Box(modifier = Modifier.align(Alignment.BottomStart).size(18.dp, 3.dp).background(Color(0xFF00E5FF)))
                    Box(modifier = Modifier.align(Alignment.BottomStart).size(3.dp, 18.dp).background(Color(0xFF00E5FF)))

                    // Bottom-Right Corner
                    Box(modifier = Modifier.align(Alignment.BottomEnd).size(18.dp, 3.dp).background(Color(0xFF00E5FF)))
                    Box(modifier = Modifier.align(Alignment.BottomEnd).size(3.dp, 18.dp).background(Color(0xFF00E5FF)))
                }
            }
        }

        // 4. Touch-to-Focus Indicator
        touchFocusPoint?.let { pt ->
            Box(
                modifier = Modifier
                    .offset(x = (pt.x / 3).dp, y = (pt.y / 3).dp)
                    .size(54.dp)
                    .border(1.5.dp, Color(0xFF00E5FF), CircleShape)
            )
        }

        // 5. Top Controls Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = onNavigateBack,
                modifier = Modifier
                    .size(42.dp)
                    .background(Color.Black.copy(alpha = 0.5f), CircleShape)
            ) {
                Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
            }

            // Scanner Status / Auto-Capture Indicator
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier
                    .background(Color.Black.copy(alpha = 0.5f), RoundedCornerShape(20.dp))
                    .padding(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .background(
                            if (uiState.sharpnessScore > 100) Color(0xFF10B981) else Color(0xFFF59E0B),
                            CircleShape
                        )
                )
                Text(
                    text = if (uiState.isAutoCaptureEnabled) "Auto-Scan ON" else "Manual Mode",
                    color = Color.White,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }

            // Flash Toggle (OFF, ON, AUTO)
            IconButton(
                onClick = {
                    viewModel.toggleFlash()
                    cameraXManager.setFlashMode(uiState.flashState)
                },
                modifier = Modifier
                    .size(42.dp)
                    .background(Color.Black.copy(alpha = 0.5f), CircleShape)
            ) {
                val icon = when (uiState.flashState) {
                    FlashState.OFF -> Icons.Default.FlashOff
                    FlashState.ON -> Icons.Default.FlashOn
                    FlashState.AUTO -> Icons.Default.FlashAuto
                }
                Icon(
                    imageVector = icon,
                    contentDescription = "Flash",
                    tint = if (uiState.flashState != FlashState.OFF) Color(0xFF00E5FF) else Color.White
                )
            }
        }

        // 6. Bottom Controls: Zoom, Exposure & Capture Buttons
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .navigationBarsPadding()
                .padding(bottom = 20.dp, start = 20.dp, end = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Zoom Selector Pills (1x, 2x, 3x)
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier
                    .background(Color.Black.copy(alpha = 0.5f), RoundedCornerShape(20.dp))
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                listOf(1.0f, 2.0f, 3.0f).forEach { zoom ->
                    Text(
                        text = "${zoom.toInt()}x",
                        color = if (uiState.zoomRatio == zoom) Color(0xFF00E5FF) else Color.White,
                        fontSize = 12.sp,
                        fontWeight = if (uiState.zoomRatio == zoom) FontWeight.Bold else FontWeight.Normal,
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .clickable {
                                viewModel.setZoom(zoom)
                                cameraXManager.setZoomRatio(zoom)
                            }
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }
            }

            // Capture & Action Controls
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Auto Capture Toggle Button
                IconButton(
                    onClick = { viewModel.toggleAutoCapture() },
                    modifier = Modifier
                        .size(48.dp)
                        .background(Color.Black.copy(alpha = 0.5f), CircleShape)
                ) {
                    Icon(
                        imageVector = if (uiState.isAutoCaptureEnabled) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                        contentDescription = "Auto Capture",
                        tint = if (uiState.isAutoCaptureEnabled) Color(0xFF00E5FF) else Color.White
                    )
                }

                // Main Capture Trigger Button
                Box(
                    modifier = Modifier
                        .size(72.dp)
                        .border(3.dp, Color(0xFF00E5FF), CircleShape)
                        .padding(6.dp)
                        .background(Color.White, CircleShape)
                        .clickable {
                            val photoFile = File(context.cacheDir, "rexgo_scan_${System.currentTimeMillis()}.jpg")
                            cameraXManager.capturePhoto(
                                outputFile = photoFile,
                                scanBoxRectNorm = android.graphics.Rect(10, 25, 90, 65),
                                onSuccess = {},
                                onError = {}
                            )
                        }
                )

                // Retake / Reset Button
                IconButton(
                    onClick = { viewModel.resetScan() },
                    modifier = Modifier
                        .size(48.dp)
                        .background(Color.Black.copy(alpha = 0.5f), CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = "Reset",
                        tint = Color.White
                    )
                }
            }
        }
    }
}
