package com.bookngo

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript.
   */
  override fun getMainComponentName(): String = "BookNGo"

  /**
   * Show splash screen before React content is loaded.
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this) // Show the native splash
    super.onCreate(savedInstanceState)
  }

  /**
   * Returns the ReactActivityDelegate instance.
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
