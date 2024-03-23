import { ExpoConfig } from "@expo/config";

export default (): ExpoConfig => ({
  name: "Fenamnow mobile",
  icon: "./assets/icon.png",
  slug: "fenamnow",
  version: "1.1.4",
  scheme: "com.fenamnow",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  assetBundlePatterns: ["**/*"],
  owner: "fliezer",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#0e96f8"
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/331a3ae4-0005-4941-a145-e5e2784eff9e"
  },
  runtimeVersion: {
    policy: "appVersion"
  },
  ios: {
    supportsTablet: false,
    usesAppleSignIn: true,
    bundleIdentifier: "com.fenamnow.ios",
    associatedDomains: ["applinks:fenamnow.com"],
    // googleServicesFile: "./GoogleService-Info.plist",
    googleServicesFile: process.env.GOOGLE_SERVICES_PLIST!,
    config: {
      usesNonExemptEncryption: false,
      googleMapsApiKey: process.env.GOOGLE_MAPS_IOS_API_KEY!
    },
    entitlements: {
      "com.apple.developer.networking.wifi-info": true
    }
  },
  android: {
    package: "com.fenamnow.android",
    adaptiveIcon: {
      backgroundColor: "#0e96f8",
      foregroundImage: "./assets/adaptive-icon.png"
    },
    // googleServicesFile: "./google-services.json",
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON!,
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY!
      }
    },
    permissions: ["RECORD_AUDIO"]
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    eas: {
      projectId: "331a3ae4-0005-4941-a145-e5e2784eff9e"
    }
  },
  experiments: {
    typedRoutes: true
  },
  plugins: [
    "expo-router",
    "expo-localization",
    "expo-apple-authentication",
    "@react-native-firebase/app",
    "@react-native-firebase/perf",
    "@react-native-firebase/crashlytics",
    "@react-native-google-signin/google-signin",
    ["./plugins/react-native-maps-plugin"],
    ["./plugins/withAndroidMainActivityAttributes"],
    ["./plugins/withAndroidQueries"],
    [
      "expo-font",
      {
        fonts: [
          "../../node_modules/@expo-google-fonts/inter/Inter_300Light.ttf",
          "../../node_modules/@expo-google-fonts/inter/Inter_400Regular.ttf",
          "../../node_modules/@expo-google-fonts/inter/Inter_500Medium.ttf",
          "../../node_modules/@expo-google-fonts/inter/Inter_600SemiBold.ttf",
          "../../node_modules/@expo-google-fonts/inter/Inter_700Bold.ttf",
          "../../node_modules/@expo-google-fonts/inter/Inter_800ExtraBold.ttf"
        ]
      }
    ],
    [
      "expo-updates",
      {
        username: "fliezer"
      }
    ],
    [
      "expo-media-library",
      {
        photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
        savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos.",
        isAccessMediaLocationEnabled: true
      }
    ],
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "$(PRODUCT_NAME) needs access to your location to help you find properties"
      }
    ],
    [
      "expo-camera",
      {
        cameraPermission: "Allow $(PRODUCT_NAME) to access your camera."
      }
    ],
    [
      "expo-av",
      {
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone."
      }
    ],
    [
      "expo-document-picker",
      {
        iCloudContainerEnvironment: "Production"
      }
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "$(PRODUCT_NAME) needs access to your photos to add photos to your listing or conversations",
        cameraPermission:
          "$(PRODUCT_NAME) needs access to your camera to add photos to your listing or conversations"
      }
    ],
    [
      "expo-media-library",
      {
        photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
        savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos.",
        isAccessMediaLocationEnabled: true
      }
    ],
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
          deploymentTarget: "15.0"
        }
      }
    ]
  ]
});
