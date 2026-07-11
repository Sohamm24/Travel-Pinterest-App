import "dotenv/config";

export default {
  expo: {
    name: "Troupe",
    slug: "troupe",
    scheme: "troupe",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logo.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: false,
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.sohamnarvankar.troupe",
      scheme: "troupe",
      infoPlist: {
        NSCameraUsageDescription:
          "TravelPinterest uses your camera to find matching travel destinations.",
        NSPhotoLibraryUsageDescription:
          "TravelPinterest accesses your photos to find matching travel destinations.",
        LSApplicationQueriesSchemes: ["https", "http"]
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/logo.png",
        backgroundColor: "#000000"
      },
      edgeToEdgeEnabled: true,
      package: "com.sohamnarvankar.troupe",
      googleServicesFile: "./google-services.json",
      permissions: [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.VIBRATE",
        "android.permission.POST_NOTIFICATIONS"
      ],
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "troupe",
              host: "*"
            }
          ],
          category: ["BROWSABLE", "DEFAULT"]
        }
      ]
    },
    web: {
      favicon: "./assets/logo.png"
    },
    plugins: [
      [
        "expo-notifications",
        {
          icon: "./assets/logo.png",
          color: "#000000",
          defaultChannel: "messages",
          sounds: []
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "TravelPinterest your photos to find matching travel destinations.",
          cameraPermission:
            "TravelPinterest uses your camera to find matching travel destinations."
        }
      ],
      [
        "expo-build-properties",
        {
          android: {
            kotlinVersion: "2.1.10"
          }
        }
      ],
      "expo-web-browser"
    ],
    extra: {
      EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      EXPO_PUBLIC_GEOAPIFY_KEY: process.env.EXPO_PUBLIC_GEOAPIFY_KEY,
      eas: {
        projectId: "4514bb9e-3e55-4ff7-a5e4-fa02cc55a859"
      }
    },
    owner: "sohamm24"
  }
};