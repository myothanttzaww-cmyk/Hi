package com.rexgo.delivery

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.rexgo.delivery.ui.navigation.RexGoNavGraph
import com.rexgo.delivery.ui.theme.RexGoTheme
import dagger.hilt.android.AndroidEntryPoint

/**
 * MainActivity - Single Activity Architecture
 * Optimized for 120Hz refresh rates and smooth edge-to-edge Compose rendering.
 */
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            RexGoTheme(darkTheme = true) { // Enforcing Dark Mode
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    RexGoNavGraph()
                }
            }
        }
    }
}
