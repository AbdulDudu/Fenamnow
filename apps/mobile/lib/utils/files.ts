import { Bucket, CameraFaceType, MediaFileType } from "@/types/files";
import { decode } from "base64-arraybuffer";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../helpers/supabase";

export const takeMedia = async ({
  type,
  cameraType
}: {
  type: MediaFileType;
  cameraType: CameraFaceType;
}) => {
  return await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 1,
    allowsMultipleSelection: false,
    aspect: [1, 1],
    mediaTypes: ImagePicker.MediaTypeOptions[type],
    cameraType: ImagePicker.CameraType[cameraType]
  });
};

export const pickMedia = async ({ type }: { type: MediaFileType }) => {
  return await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    quality: 1,
    allowsMultipleSelection: false,
    aspect: [1, 1],
    mediaTypes: ImagePicker.MediaTypeOptions[type]
  });
};

export const pickDocument = async () => {
  return await DocumentPicker.getDocumentAsync({
    multiple: false
  });
};

export const upload = async ({
  result,
  bucket,
  filePath
}: {
  result: ImagePicker.ImagePickerResult | DocumentPicker.DocumentPickerResult;
  bucket: Bucket;
  filePath?: string;
}) => {
  const pickedResult:
    | ImagePicker.ImagePickerAsset
    | DocumentPicker.DocumentPickerAsset
    | false = !result.canceled && result.assets[0];

  let ext;
  let path = "";
  let base64 = "";

  const file = pickedResult;
  const fileType = (
    file as DocumentPicker.DocumentPickerAsset
  ).mimeType?.startsWith("application")
    ? "file"
    : (file as ImagePicker.ImagePickerAsset).type;
  // @ts-expect-error
  ext = file.uri.split(".").pop()?.toLowerCase();

  if (file) {
    path =
      filePath ||
      `${fileType}s/${fileType == "file" ? (file as DocumentPicker.DocumentPickerAsset).name.split(".").shift() : file.uri.split("/").pop()?.split(".").shift() || Date.now()}.${ext}`;
    base64 = await FileSystem.readAsStringAsync(file.uri, {
      encoding: "base64"
    });
  }

  const form = new FormData();
  form.append("file", file as any);

  // @ts-expect-error
  const contentType = file.mimeType || `${fileType}/${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, decode(base64), { contentType });

  return {
    data,
    error
  };
};

export const uploadAudio = async ({
  path,
  bucket,
  fileUri
}: {
  path: string;
  bucket: string;
  fileUri: string;
}) => {
  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: "base64"
  });

  const fileExt = fileUri.split(".").pop()!;
  const filePath = `${path}.m4a`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, decode(base64), {
      contentType: `audio/${fileExt}`
    });
  console.log("data", data);
  console.log("error", error);
  return data;
};
