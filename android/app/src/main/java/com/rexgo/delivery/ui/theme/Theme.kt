package com.rexgo.delivery.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val RexGoDarkColorScheme = darkColorScheme(
    primary = PrimaryCyan,
    onPrimary = DarkBackground,
    primaryContainer = DarkSurfaceVariant,
    onPrimaryContainer = PrimaryCyan,
    secondary = SecondaryTeal,
    onSecondary = DarkBackground,
    background = DarkBackground,
    onBackground = TextPrimary,
    surface = DarkSurface,
    onSurface = TextPrimary,
    surfaceVariant = DarkSurfaceVariant,
    onSurfaceVariant = TextSecondary,
    error = ErrorRed,
    onError = TextPrimary
)

@Composable
fun RexGoTheme(
    darkTheme: Boolean = true, // Dark mode enforced per specification
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = RexGoDarkColorScheme,
        typography = Typography,
        content = content
    )
}
