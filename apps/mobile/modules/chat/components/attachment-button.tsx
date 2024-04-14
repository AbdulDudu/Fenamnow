import {
  Button,
  ButtonIcon,
  Icon,
  Menu,
  MenuItem,
  MenuItemLabel
} from "@gluestack-ui/themed";
import {
  BookImage,
  Camera,
  File,
  MapPin,
  PlusCircle
} from "lucide-react-native";
import { useState } from "react";
import { Keyboard } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { useMessageInputContext } from "stream-chat-expo";
import LocationInput from "./location-input";

export default function AttachmentButton() {
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const handleMapSheet = () => setShowLocationSheet(!showLocationSheet);
  const { pickFile, uploadNewImage } = useMessageInputContext();

  return (
    <>
      <Menu
        placement="top"
        selectionMode="single"
        crossOffset={32}
        onOpen={() => {
          if (Keyboard.isVisible()) {
            Keyboard.dismiss();
          }
        }}
        onSelectionChange={async (keys: any) => {
          switch (keys.currentKey) {
            case "photos-and-videos":
              ImagePicker.openPicker({
                multiple: true,
                cropping: true,
                maxFiles: 10
              })
                .then(images =>
                  images.forEach(image => {
                    console.log(image);
                    uploadNewImage({
                      uri: image.path
                    });
                  })
                )
                .catch(e => console.log(e));
              break;
            case "camera":
              ImagePicker.openCamera({
                cropping: true
              })
                .then(image =>
                  uploadNewImage({
                    uri: image.path
                  })
                )
                .catch(e => console.log(e));
              break;
            case "files":
              pickFile();
              break;
            case "location":
              handleMapSheet();
              break;
            default:
              break;
          }
        }}
        trigger={({ ...triggerProps }) => {
          return (
            <Button variant="link" {...triggerProps}>
              <ButtonIcon size="lg" as={PlusCircle} />
            </Button>
          );
        }}
      >
        <MenuItem key="photos-and-videos" textValue="Photos and Videos">
          <Icon as={BookImage} size="sm" mr="$2" />
          <MenuItemLabel size="sm">Photos and Videos</MenuItemLabel>
        </MenuItem>
        <MenuItem key="camera" textValue="Camera">
          <Icon as={Camera} size="sm" mr="$2" />
          <MenuItemLabel size="sm">Camera</MenuItemLabel>
        </MenuItem>
        <MenuItem key="files" textValue="Files">
          <Icon as={File} size="sm" mr="$2" />
          <MenuItemLabel size="sm">Files</MenuItemLabel>
        </MenuItem>
        <MenuItem key="location" textValue="Location">
          <Icon as={MapPin} size="sm" mr="$2" />
          <MenuItemLabel size="sm">Location</MenuItemLabel>
        </MenuItem>
      </Menu>

      <LocationInput
        handleMapSheet={handleMapSheet}
        showLocationSheet={showLocationSheet}
      />
    </>
  );
}
