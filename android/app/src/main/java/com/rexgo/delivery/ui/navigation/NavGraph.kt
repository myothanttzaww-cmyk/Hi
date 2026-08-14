package com.rexgo.delivery.ui.navigation

import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.rexgo.delivery.domain.model.OcrResult
import com.rexgo.delivery.ui.screens.home.HomeScreen
import com.rexgo.delivery.ui.screens.login.LoginScreen
import com.rexgo.delivery.ui.screens.scanner.OcrResultScreen
import com.rexgo.delivery.ui.screens.scanner.ScannerScreen
import com.rexgo.delivery.ui.screens.settings.SettingsScreen
import com.rexgo.delivery.ui.screens.splash.SplashScreen

@Composable
fun RexGoNavGraph(
    navController: NavHostController = rememberNavController(),
    startDestination: String = Screen.Splash.route
) {
    var lastOcrResult by remember { mutableStateOf<OcrResult?>(null) }

    NavHost(
        navController = navController,
        startDestination = startDestination,
        enterTransition = { fadeIn(animationSpec = tween(250)) },
        exitTransition = { fadeOut(animationSpec = tween(250)) }
    ) {
        composable(route = Screen.Splash.route) {
            SplashScreen(
                onNavigateToLogin = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Splash.route) { inclusive = true }
                    }
                }
            )
        }

        composable(route = Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                }
            )
        }

        composable(route = Screen.Home.route) {
            HomeScreen(
                onNavigateToSettings = {
                    navController.navigate(Screen.Settings.route)
                },
                onNavigateToScanner = {
                    navController.navigate(Screen.Scanner.route)
                }
            )
        }

        composable(route = Screen.Scanner.route) {
            ScannerScreen(
                onNavigateBack = {
                    navController.popBackStack()
                },
                onOcrResultReady = { result ->
                    lastOcrResult = result
                    navController.navigate(Screen.OcrResult.route) {
                        popUpTo(Screen.Scanner.route) { inclusive = true }
                    }
                }
            )
        }

        composable(route = Screen.OcrResult.route) {
            lastOcrResult?.let { ocr ->
                OcrResultScreen(
                    ocrResult = ocr,
                    onRescan = {
                        navController.navigate(Screen.Scanner.route) {
                            popUpTo(Screen.OcrResult.route) { inclusive = true }
                        }
                    },
                    onContinue = { finalPhone ->
                        // Ready for Phase 3 Customer Search / Task Queue
                        navController.navigate(Screen.Home.route) {
                            popUpTo(Screen.Home.route) { inclusive = false }
                        }
                    }
                )
            }
        }

        composable(route = Screen.Settings.route) {
            SettingsScreen(
                onNavigateBack = {
                    navController.popBackStack()
                },
                onLogoutSuccess = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Home.route) { inclusive = true }
                    }
                }
            )
        }
    }
}
