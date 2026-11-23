# Preserve debug line numbers cleanly without revealing local file paths
-keepattributes SourceFile,LineNumberTable,*Annotation*,Signature,InnerClasses,EnclosingMethod
-renamesourcefileattribute SourceFile

# Capacitor 8 Core & WebView JavaScript Bridge
-keep class com.getcapacitor.** { *; }
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod <methods>;
    @android.webkit.JavascriptInterface <methods>;
}
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keepclassmembers class * extends com.getcapacitor.Plugin {
    <init>();
    <methods>;
}

# Capacitor Official Plugins (@capacitor/app, @capacitor/browser)
-keep class com.capacitorjs.plugins.** { *; }

# @capgo/capacitor-updater (OTA bundle manager & rollback engine)
-keep class ee.forgr.capacitor_updater.** { *; }
-keepclassmembers class ee.forgr.capacitor_updater.** { *; }

# AndroidX SplashScreen & Custom Tabs Browser
-keep class androidx.core.splashscreen.** { *; }
-keep class androidx.browser.** { *; }

# Keep MainActivity & app classes
-keep class com.meow.app.** { *; }

# OkHttp / Kotlin optional warnings suppression
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-dontwarn org.conscrypt.**
