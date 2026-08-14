package com.rexgo.delivery.ui.navigation

sealed class Screen(val route: String) {
    data object Splash : Screen("splash_screen")
    data object Login : Screen("login_screen")
    data object Home : Screen("home_screen")
    data object Settings : Screen("settings_screen")
    data object Scanner : Screen("scanner_screen")
    data object OcrResult : Screen("ocr_result_screen")
}
