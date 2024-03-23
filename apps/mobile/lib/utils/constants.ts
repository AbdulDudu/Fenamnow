import * as ImagePicker from "expo-image-picker";
import { Dimensions } from "react-native";

export const WIDTH = Dimensions.get("window").width;
export const HEIGHT = Dimensions.get("window").height;
export const MEDIA_TYPE = ImagePicker.MediaTypeOptions;
export const CAMERA_TYPE = ImagePicker.CameraType;
export const BLUR_HASH =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
export const URL_REGEX = /(https?:\/\/[^\s]+)/g;
export const PHONE_REGEX = /(\+\d{1,2}\s?)?(\d{3}|\(\d{3}\))([\s.-]?\d{3}){2}/g;
export const EMAIL_REGEX =
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

export const leaseDuration: Record<string, string> = {
  month: "m",
  "6 months": "6 mths",
  year: "year",
  "2 years": "2 yrs",
  "more than 2 years": "2 yrs+"
};
