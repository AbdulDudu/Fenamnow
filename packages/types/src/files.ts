import * as ImagePicker from "expo-image-picker";

export type MediaFileType = {} & ImagePicker.MediaTypeOptions;
export type CameraFaceType = {} & ImagePicker.CameraType;
export type Bucket = "properties" | "chat" | "avatars" | string;
export type MediaResult =
  | ImagePicker.ImagePickerResult
  | ImagePicker.ImagePickerSuccessResult;
