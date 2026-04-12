import "dotenv/config";

export default {
  expo: {
    name: "TravelPinterest",
    slug: "travel-pinterest",
    scheme: "travelpinterest",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logo.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#000000"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.sohamnarvankar.travelpinterest",
      scheme: "travelpinterest",
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
      package: "com.sohamnarvankar.travelpinterest",
      permissions: [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.READ_MEDIA_IMAGES"
      ],
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "travelpinterest",
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
      "expo-secure-store",
      "expo-web-browser"
    ],
    extra: {
      EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      eas: {
        projectId: "7c913bad-7571-49a6-8530-99af7de02c37"
      }
    },
    owner: "soham-narvankar"
  }
};