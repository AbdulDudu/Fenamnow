import crashlytics from "@react-native-firebase/crashlytics";

export enum ErrorType {
  FATAL = "Fatal",
  HANDLED = "Handled"
}

export const reportCrash = (
  error: Error,
  type: ErrorType = ErrorType.FATAL
) => {
  if (__DEV__) {
    // Log to console and Reactotron in development
    const message = error.message || "Unknown";
    console.error(error);
    console.log(message, type);
  } else {
    crashlytics().recordError(error);
  }
};
