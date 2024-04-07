import { ExpoConfig } from "@expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
export default (): ExpoConfig => ({
  name: "Fenamnow mobile",
  icon: "./assets/icon.png",
  slug: "fenamnow",
  version: "1.2.1",
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
    googleServicesFile: IS_DEV
      ? "./GoogleService-Info.plist"
      : process.env.GOOGLE_SERVICES_PLIST!,
    config: {
      usesNonExemptEncryption: false,
      googleMapsApiKey: process.env.GOOGLE_MAPS_IOS_API_KEY!
    },
    entitlements: {
      "com.apple.developer.networking.wifi-info": true
    },
    infoPlist: {
      UIBackgroundModes: ["location", "fetch", "remote-notification"]
    }
  },
  android: {
    icon: "./assets/icon.png",
    package: "com.fenamnow.android",
    adaptiveIcon: {
      backgroundColor: "#0e96f8",
      foregroundImage: "./assets/adaptive-icon.png"
    },
    googleServicesFile: IS_DEV
      ? "./google-services.json"
      : process.env.GOOGLE_SERVICES_JSON!,
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY!
      }
    },
    permissions: [
      "android.permission.RECORD_AUDIO",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.READ_EXTERNAL_STORAGE"
    ],
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "https",
            host: "*.fenamnow.com",
            pathPrefix: "/property/"
          },
          {
            scheme: "https",
            host: "*.fenamnow.com",
            pathPrefix: "/search/"
          },
          {
            scheme: "https",
            host: "*.fenamnow.com",
            pathPrefix: "/chat/"
          }
        ],
        category: ["BROWSABLE", "DEFAULT"]
      }
    ]
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
    "react-native-compressor",
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
          "../../node_modules/@expo-google-fonts/noto-sans/NotoSans_300Light.ttf",
          "../../node_modules/@expo-google-fonts/noto-sans/NotoSans_400Regular.ttf",
          "../../node_modules/@expo-google-fonts/noto-sans/NotoSans_500Medium.ttf",
          "../../node_modules/@expo-google-fonts/noto-sans/NotoSans_600SemiBold.ttf",
          "../../node_modules/@expo-google-fonts/noto-sans/NotoSans_700Bold.ttf",
          "../../node_modules/@expo-google-fonts/noto-sans/NotoSans_800ExtraBold.ttf"
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
        cameraPermission:
          "$(PRODUCT_NAME) needs access to your camera to add photos to your listing or conversations"
      }
    ],
    [
      "expo-av",
      {
        microphonePermission:
          "$(PRODUCT_NAME) needs access to your microphone to record audio messages"
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
        },
        android: {
          minSdkVersion: 24,
          kotlinVersion: "1.6.10",
          extraMavenRepos: [
            "../../../../node_modules/@notifee/react-native/android/libs"
          ]
        }
      }
    ]
  ]
});
