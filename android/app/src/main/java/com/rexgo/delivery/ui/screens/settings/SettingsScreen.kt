package com.rexgo.delivery.ui.screens.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.rexgo.delivery.data.storage.LocalStorageManager
import com.rexgo.delivery.ui.screens.login.LoginViewModel
import com.rexgo.delivery.ui.theme.CardBorder
import com.rexgo.delivery.ui.theme.DarkBackground
import com.rexgo.delivery.ui.theme.DarkSurface
import com.rexgo.delivery.ui.theme.DarkSurfaceVariant
import com.rexgo.delivery.ui.theme.ErrorRed
import com.rexgo.delivery.ui.theme.PrimaryCyan
import com.rexgo.delivery.ui.theme.SecondaryTeal
import com.rexgo.delivery.ui.theme.TextMuted
import com.rexgo.delivery.ui.theme.TextPrimary
import com.rexgo.delivery.ui.theme.TextSecondary
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    onNavigateBack: () -> Unit,
    onLogoutSuccess: () -> Unit,
    loginViewModel: LoginViewModel = hiltViewModel()
) {
    var showLogoutDialog by remember { mutableStateOf(false) }
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Settings",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = TextPrimary
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = DarkBackground
                )
            )
        },
        containerColor = DarkBackground
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 12.dp)
        ) {
            // Section 1: Appearance & Display
            SectionHeader(title = "အသွင်အပြင် (Appearance)")

            SettingsItemCard {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconBadge(icon = Icons.Default.DarkMode, tint = PrimaryCyan)
                        Spacer(modifier = Modifier.width(14.dp))
                        Column {
                            Text(
                                text = "Dark Mode",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = TextPrimary
                            )
                            Text(
                                text = "အမြဲတမ်းဖွင့်ထားသည် (Always Enabled)",
                                fontSize = 12.sp,
                                color = TextSecondary
                            )
                        }
                    }

                    // Enforced Always ON per requirement
                    Switch(
                        checked = true,
                        onCheckedChange = { /* Disabled / Enforced Dark Mode */ },
                        enabled = false,
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = PrimaryCyan,
                            checkedTrackColor = PrimaryCyan.copy(alpha = 0.3f),
                            disabledCheckedThumbColor = PrimaryCyan,
                            disabledCheckedTrackColor = PrimaryCyan.copy(alpha = 0.4f)
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Section 2: Architecture & Storage Status
            SectionHeader(title = "စနစ်ဖွဲ့စည်းပုံ အခြေအနေ (Architecture Status)")

            SettingsItemCard {
                Column(modifier = Modifier.fillMaxWidth()) {
                    ArchitectureRow(
                        icon = Icons.Default.Folder,
                        title = "Local Scoped Storage",
                        subtitle = "Downloads/RexGo (7 Subdirectories)",
                        status = "Initialized",
                        statusColor = SecondaryTeal
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    ArchitectureRow(
                        icon = Icons.Default.Security,
                        title = "Permission Architecture",
                        subtitle = "Modular Structure Ready",
                        status = "Phase 1 Ready",
                        statusColor = PrimaryCyan
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    ArchitectureRow(
                        icon = Icons.Default.CameraAlt,
                        title = "CameraX Module Scaffold",
                        subtitle = "Hardware Inactive (No OCR/ML in P1)",
                        status = "Standby",
                        statusColor = Color(0xFFFFD54F)
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    ArchitectureRow(
                        icon = Icons.Default.Speed,
                        title = "Device Optimization",
                        subtitle = "Redmi Turbo 4 Pro / 120Hz Smooth",
                        status = "120 FPS",
                        statusColor = SecondaryTeal
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Section 3: About & Developer Credits
            SectionHeader(title = "App အကြောင်း (About RexGo)")

            SettingsItemCard {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            IconBadge(icon = Icons.Default.Info, tint = PrimaryCyan)
                            Spacer(modifier = Modifier.width(14.dp))
                            Column {
                                Text(
                                    text = "Version",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = TextPrimary
                                )
                                Text(
                                    text = "Native Android Jetpack Compose",
                                    fontSize = 12.sp,
                                    color = TextSecondary
                                )
                            }
                        }

                        Text(
                            text = "1.0.0",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryCyan
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(1.dp)
                            .background(CardBorder)
                    )
                    Spacer(modifier = Modifier.height(16.dp))

                    Column {
                        Text(
                            text = "Developer Credit",
                            fontSize = 12.sp,
                            color = TextMuted
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Powered by Myo Thant Zaw",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryCyan
                        )
                        Text(
                            text = "Senior Native Android Logistics Delivery Architecture",
                            fontSize = 12.sp,
                            color = TextSecondary,
                            modifier = Modifier.padding(top = 2.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Logout Action
            Button(
                onClick = { showLogoutDialog = true },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = ErrorRed.copy(alpha = 0.15f),
                    contentColor = ErrorRed
                )
            ) {
                Icon(
                    imageVector = Icons.Default.Logout,
                    contentDescription = "Logout",
                    tint = ErrorRed,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "အကောင့်မှ ထွက်ရန် (Logout)",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }

            Spacer(modifier = Modifier.height(30.dp))
        }
    }

    if (showLogoutDialog) {
        AlertDialog(
            onDismissRequest = { showLogoutDialog = false },
            title = {
                Text(
                    text = "အကောင့်မှ ထွက်ခွာမည်လား",
                    color = TextPrimary,
                    fontWeight = FontWeight.Bold
                )
            },
            text = {
                Text(
                    text = "အကောင့်မှ ထွက်ခွာပါက လက်ရှိ Session ကို ရှင်းလင်းမည် ဖြစ်ပါသည်။ (Remember Me ပြုလုပ်ထားပါက Employee ID ကို သိမ်းဆည်းထားပါမည်)",
                    color = TextSecondary,
                    fontSize = 14.sp
                )
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        showLogoutDialog = false
                        onLogoutSuccess()
                    }
                ) {
                    Text(text = "ထွက်မည်", color = ErrorRed, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showLogoutDialog = false }) {
                    Text(text = "မထွက်ပါ", color = TextSecondary)
                }
            },
            containerColor = DarkSurface,
            shape = RoundedCornerShape(16.dp)
        )
    }
}

@Composable
private fun SectionHeader(title: String) {
    Text(
        text = title,
        fontSize = 13.sp,
        fontWeight = FontWeight.SemiBold,
        color = TextSecondary,
        modifier = Modifier.padding(bottom = 8.dp)
    )
}

@Composable
private fun SettingsItemCard(content: @Composable () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(DarkSurface)
            .border(1.dp, CardBorder, RoundedCornerShape(14.dp))
            .padding(16.dp)
    ) {
        content()
    }
}

@Composable
private fun IconBadge(icon: ImageVector, tint: Color) {
    Box(
        modifier = Modifier
            .size(36.dp)
            .clip(RoundedCornerShape(10.dp))
            .background(tint.copy(alpha = 0.15f)),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = tint,
            modifier = Modifier.size(20.dp)
        )
    }
}

@Composable
private fun ArchitectureRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    status: String,
    statusColor: Color
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.weight(1f)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = TextSecondary,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(10.dp))
            Column {
                Text(
                    text = title,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium,
                    color = TextPrimary
                )
                Text(
                    text = subtitle,
                    fontSize = 11.sp,
                    color = TextMuted
                )
            }
        }

        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(6.dp))
                .background(statusColor.copy(alpha = 0.15f))
                .padding(horizontal = 8.dp, vertical = 4.dp)
        ) {
            Text(
                text = status,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = statusColor
            )
        }
    }
}
