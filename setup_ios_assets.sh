#!/bin/bash
set -e

IOS_DIR="ios/BookNGo/Images.xcassets"
APPICON_DIR="$IOS_DIR/AppIcon.appiconset"
SPLASH_DIR="$IOS_DIR/SplashScreen.imageset"
ANDROID_ICON="android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png"
ANDROID_SPLASH="android/app/src/main/res/drawable/splash_screen.png"

# Setup AppIcon
mkdir -p "$APPICON_DIR"
sips -z 1024 1024 "$ANDROID_ICON" --out "$APPICON_DIR/icon-1024.png"
cat << 'JSON_EOF' > "$APPICON_DIR/Contents.json"
{
  "images" : [
    {
      "filename" : "icon-1024.png",
      "idiom" : "universal",
      "platform" : "ios",
      "size" : "1024x1024"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
JSON_EOF

# Setup SplashScreen
mkdir -p "$SPLASH_DIR"
cp "$ANDROID_SPLASH" "$SPLASH_DIR/splash.png"
cat << 'JSON_EOF' > "$SPLASH_DIR/Contents.json"
{
  "images" : [
    {
      "filename" : "splash.png",
      "idiom" : "universal"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
JSON_EOF

echo "Done generating assets."
