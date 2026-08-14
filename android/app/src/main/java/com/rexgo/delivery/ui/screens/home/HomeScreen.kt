package com.rexgo.delivery.ui.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.HourglassTop
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.SignalCellularAlt
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.rexgo.delivery.ui.components.DashboardCard
import com.rexgo.delivery.ui.components.RexGoTopBar
import com.rexgo.delivery.ui.theme.AccentOrange
import com.rexgo.delivery.ui.theme.CardBorder
import com.rexgo.delivery.ui.theme.DarkBackground
import com.rexgo.delivery.ui.theme.DarkSurface
import com.rexgo.delivery.ui.theme.PrimaryCyan
import com.rexgo.delivery.ui.theme.SecondaryTeal
import com.rexgo.delivery.ui.theme.TextMuted
import com.rexgo.delivery.ui.theme.TextPrimary
import com.rexgo.delivery.ui.theme.TextSecondary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onNavigateToSettings: () -> Unit,
    onNavigateToScanner: () -> Unit = {},
    viewModel: HomeViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            RexGoTopBar(
                title = "RexGo Hub",
                subtitle = "Dashboard",
                onSettingsClick = onNavigateToSettings
            )
        },
        containerColor = DarkBackground
    ) { paddingValues ->
        PullToRefreshBox(
            isRefreshing = uiState.isRefreshing,
            onRefresh = { viewModel.refreshDashboard() },
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Rider Welcome Banner
                item(span = { GridItemSpan(2) }) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 8.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(DarkSurface)
                            .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                            .padding(16.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "မင်္ဂလာပါ",
                                    fontSize = 13.sp,
                                    color = TextMuted
                                )
                                Text(
                                    text = "ID: ${uiState.employeeId}",
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PrimaryCyan
                                )
                            }

                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(20.dp))
                                    .background(SecondaryTeal.copy(alpha = 0.15f))
                                    .padding(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(8.dp)
                                            .clip(RoundedCornerShape(4.dp))
                                            .background(SecondaryTeal)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "Online Ready",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = SecondaryTeal
                                    )
                                }
                            }
                        }
                    }
                }

                // Section Label
                item(span = { GridItemSpan(2) }) {
                    Text(
                        text = "ယနေ့ လုပ်ငန်းအခြေအနေ (Today's Summary)",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = TextSecondary,
                        modifier = Modifier.padding(top = 4.dp, bottom = 2.dp)
                    )
                }

                // Card 1: Today's Parcels
                item {
                    DashboardCard(
                        title = "Today's Parcels",
                        titleMyanmar = "ယနေ့ ပါဆယ်စုစုပေါင်း",
                        value = uiState.todaysParcelsCount,
                        icon = Icons.Default.Inventory2,
                        iconColor = PrimaryCyan,
                        statusBadge = "Pending",
                        statusColor = PrimaryCyan
                    )
                }

                // Card 2: Completed
                item {
                    DashboardCard(
                        title = "Completed",
                        titleMyanmar = "ပို့ဆောင်ပြီးစီး",
                        value = uiState.completedCount,
                        icon = Icons.Default.CheckCircle,
                        iconColor = SecondaryTeal,
                        statusBadge = "Done",
                        statusColor = SecondaryTeal
                    )
                }

                // Card 3: Remaining
                item {
                    DashboardCard(
                        title = "Remaining",
                        titleMyanmar = "ကျန်ရှိနေသော ပါဆယ်",
                        value = uiState.remainingCount,
                        icon = Icons.Default.HourglassTop,
                        iconColor = AccentOrange,
                        statusBadge = "Queue",
                        statusColor = AccentOrange
                    )
                }

                // Card 4: Connection Status
                item {
                    DashboardCard(
                        title = "Connection",
                        titleMyanmar = "ချိတ်ဆက်မှု အခြေအနေ",
                        value = "Active",
                        icon = Icons.Default.SignalCellularAlt,
                        iconColor = SecondaryTeal,
                        statusBadge = "Ready",
                        statusColor = SecondaryTeal
                    )
                }

                // Card 5: Customers
                item {
                    DashboardCard(
                        title = "Customers",
                        titleMyanmar = "ဖောက်သည်စာရင်း",
                        value = uiState.totalCustomers,
                        icon = Icons.Default.People,
                        iconColor = Color(0xFFB388FF),
                        statusBadge = "Phase 2",
                        statusColor = Color(0xFFB388FF)
                    )
                }

                // Card 6: Today's Scan
                item {
                    DashboardCard(
                        title = "Today's Scan",
                        titleMyanmar = "ယနေ့ စကင်ဖတ်မှု",
                        value = uiState.todaysScanCount,
                        icon = Icons.Default.QrCodeScanner,
                        iconColor = Color(0xFFFFD54F),
                        statusBadge = "Scan",
                        statusColor = Color(0xFFFFD54F),
                        onClick = onNavigateToScanner
                    )
                }

                // Bottom Spacing & Developer Credit
                item(span = { GridItemSpan(2) }) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "RexGo Delivery Suite v1.0.0",
                            fontSize = 12.sp,
                            color = TextMuted
                        )
                        Text(
                            text = "Powered by Myo Thant Zaw",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = PrimaryCyan
                        )
                    }
                }
            }
        }
    }
}
