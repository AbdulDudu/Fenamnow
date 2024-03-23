import { AsyncLocalStorage } from "async_hooks";
import { getPublicUrl, supabase } from "@/lib/helpers/supabase";
import { useSession } from "@/lib/providers/session";
import { CAMERA_TYPE, MEDIA_TYPE } from "@/lib/utils/constants";
import { pickMedia, takeMedia, upload } from "@/lib/utils/files";
import { toast, ToastPosition } from "@backpackapp-io/react-native-toast";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  AlertCircleIcon,
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  HStack,
  Input,
  InputField,
  onChange,
  ScrollView,
  Spinner,
  Text,
  View,
  VStack
} from "@gluestack-ui/themed";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "@supabase/supabase-js";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as z from "zod";

const profileSchema = z.object({
  avatar_url: z.string().optional(),
  full_name: z.string().min(4, { message: "Full name too short" }).optional(),
  display_name: z.optional(z.string())
});
export default function ProfileSettings({
  session
}: {
  session: Session | null | undefined;
}) {
  const [editMode, setEditMode] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const {
    control,
    handleSubmit,
    clearErrors,
    getValues,
    setValue,
    setError,
    watch,
    formState: { errors }
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      avatar_url: "",
      full_name: "",
      display_name: ""
    },
    values: {
      avatar_url: session?.user.user_metadata.avatar_url,
      full_name: session?.user.user_metadata.full_name,
      display_name: session?.user.user_metadata.display_name
    }
  });

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data
      });
      if (error) {
        throw error;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          display_name: data.display_name as string,
          id: session?.user.id!,
          avatar_url: data.avatar_url,
          full_name: data.full_name
        })
        .eq("id", session?.user.id!);

      if (!profileError) {
        toast.success("Profile updated successfully", {
          position: ToastPosition.BOTTOM
        });
        setEditMode(false);
      }
    } catch (error: any) {
      toast.error(error.message, {
        position: ToastPosition.BOTTOM
      });
    }
  };
  return (
    <KeyboardAwareScrollView
      extraHeight={Platform.OS == "android" ? 150 : 150}
      enableOnAndroid={Platform.OS == "android"}
    >
      <ScrollView>
        <View pt="$4" paddingHorizontal="$6">
          <VStack
            gap="$4"
            sx={{
              _dark: {
                backgroundColor: "$secondary800"
              },
              _light: {
                backgroundColor: "$white"
              }
            }}
            rounded="$lg"
            p="$4"
          >
            <View>
              <Controller
                control={control}
                name="avatar_url"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormControl
                    size="md"
                    isDisabled={!editMode}
                    isInvalid={false}
                    isReadOnly={false}
                    isRequired={false}
                  >
                    <FormControlLabel mb="$1">
                      <FormControlLabelText>Profile Photo</FormControlLabelText>
                    </FormControlLabel>
                    <HStack
                      height="$32"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      {/* Photo container */}
                      <VStack
                        rounded="$full"
                        width="$24"
                        height="$24"
                        borderWidth="$1"
                        borderColor="$secondary200"
                        alignItems="center"
                        opacity={uploadingAvatar ? 0.5 : 1}
                        position="relative"
                        justifyContent="center"
                      >
                        {value == "" || !value ? (
                          <FontAwesome5 name="user" size={48} color="#5F5F5F" />
                        ) : (
                          <Image
                            contentFit="cover"
                            source={getPublicUrl(value, "avatars")}
                            style={{
                              height: "100%",
                              borderRadius: 150,
                              width: "100%"
                            }}
                          />
                        )}
                        {uploadingAvatar && <Spinner position="absolute" />}
                      </VStack>

                      {/* Actions */}
                      <VStack width="$1/2" gap="$2">
                        <Button
                          isDisabled={!editMode}
                          onPress={async () =>
                            await pickMedia({ type: MEDIA_TYPE.Images })
                              .then(async res => {
                                console.log(res);
                                if (res.canceled) return;
                                setUploadingAvatar(true);
                                const uploadRes = await upload({
                                  result: res,
                                  bucket: `avatars`
                                });
                                if (uploadRes.error) {
                                  console.log(uploadRes.error);
                                  setUploadingAvatar(false);

                                  throw uploadRes.error;
                                }
                                setUploadingAvatar(false);

                                onChange(uploadRes.data?.path);
                              })
                              .catch(err => {
                                console.log(err.message);
                                toast(`Error: ${err.message}`, {
                                  position: ToastPosition.BOTTOM
                                });
                              })
                          }
                        >
                          <ButtonText>Upload</ButtonText>
                        </Button>
                        <Button
                          isDisabled={!editMode}
                          onPress={async () => {
                            await ImagePicker.requestCameraPermissionsAsync();

                            takeMedia({
                              type: MEDIA_TYPE.Images,
                              cameraType: CAMERA_TYPE.front
                            })
                              .then(async res => {
                                console.log(res);
                                if (res.canceled) return;
                                setUploadingAvatar(true);
                                const uploadRes = await upload({
                                  result: res,
                                  bucket: `avatars`
                                });
                                if (uploadRes.error) {
                                  console.log(uploadRes.error);
                                  setUploadingAvatar(false);

                                  throw uploadRes.error;
                                }
                                setUploadingAvatar(false);

                                onChange(uploadRes.data?.path);
                              })
                              .catch(err => {
                                console.log(err.message);
                                toast(`Error: ${err.message}`, {
                                  position: ToastPosition.BOTTOM
                                });
                              });
                          }}
                        >
                          <ButtonText>Take Photo</ButtonText>
                        </Button>
                      </VStack>
                    </HStack>
                  </FormControl>
                )}
              />
            </View>
            {/* Full name input */}
            <Controller
              control={control}
              name="full_name"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl
                  size="md"
                  isDisabled={!editMode}
                  isInvalid={errors.full_name?.message != undefined}
                  isRequired
                >
                  <FormControlLabel mb="$1">
                    <FormControlLabelText>Full name</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      type="text"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      defaultValue={value}
                      placeholder="Enter your full name"
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                      {errors.full_name?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            {/* Display name input */}
            <Controller
              control={control}
              name="display_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl
                  size="md"
                  isDisabled={!editMode}
                  isInvalid={errors.display_name?.message != undefined}
                  isReadOnly={false}
                  isRequired={false}
                >
                  <FormControlLabel mb="$1">
                    <FormControlLabelText>Display name</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      type="text"
                      value={value ?? undefined}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      defaultValue={value ?? undefined}
                      placeholder="Enter your Display name"
                    />
                  </Input>
                  <FormControlHelper>
                    <FormControlHelperText>
                      Users will see this instead of your full name
                    </FormControlHelperText>
                  </FormControlHelper>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                      {errors.display_name?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            <HStack justifyContent="space-between">
              {editMode ? (
                <>
                  <Button action="negative" onPress={() => setEditMode(false)}>
                    <ButtonText>Cancel</ButtonText>
                  </Button>
                  <Button onPress={handleSubmit(onSubmit)}>
                    <ButtonText>Save</ButtonText>
                  </Button>
                </>
              ) : (
                <Button onPress={() => setEditMode(true)}>
                  <ButtonText>Edit Profile</ButtonText>
                </Button>
              )}
            </HStack>
          </VStack>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
