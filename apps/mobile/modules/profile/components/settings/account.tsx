import { supabase } from "@/lib/helpers/supabase";
import { useSession } from "@/lib/providers/session";
import { toast, ToastPosition } from "@backpackapp-io/react-native-toast";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  AlertCircleIcon,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Box,
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonText,
  CloseIcon,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  HStack,
  Icon,
  Input,
  InputField,
  ScrollView,
  Text,
  View,
  VStack
} from "@gluestack-ui/themed";
import { Session } from "@supabase/supabase-js";
import { Check, PencilIcon, XIcon } from "lucide-react-native";
import { useState } from "react";
import { Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function AccountSettings({
  session,
  deleteAccount
}: {
  session: Session | null | undefined;
  deleteAccount: () => Promise<void>;
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  const [email, setEmail] = useState(session?.user.email);
  return (
    <KeyboardAwareScrollView
      extraHeight={Platform.OS == "android" ? 150 : 150}
      enableOnAndroid={Platform.OS == "android"}
    >
      <ScrollView pt="$4" paddingHorizontal="$6">
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
          {/* Email input */}
          <FormControl
            size="md"
            isDisabled={!editEmail}
            isInvalid={false}
            isReadOnly={false}
            isRequired={false}
          >
            <FormControlLabel mb="$1" justifyContent="space-between">
              <FormControlLabelText>Email</FormControlLabelText>
              <Button
                variant="link"
                onPress={() => {
                  setEmail(editEmail ? session?.user.email : "");
                  setEditEmail(!editEmail);
                }}
              >
                {editEmail ? (
                  <ButtonIcon size="xl" color="$error500" as={XIcon} />
                ) : (
                  <ButtonIcon size="xl" color="$primary500" as={PencilIcon} />
                )}
              </Button>
            </FormControlLabel>
            <Input>
              <InputField
                defaultValue={email}
                value={email}
                onChangeText={e => setEmail(e)}
                type="text"
                placeholder="Enter your full name"
              />
            </Input>
            {editEmail ? (
              <FormControlHelper>
                <FormControlHelperText>
                  Type in new email to change
                </FormControlHelperText>
              </FormControlHelper>
            ) : null}
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                At least 6 characters are required.
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          {/* Password input */}
          <FormControl
            size="md"
            isDisabled={!editEmail}
            isInvalid={false}
            isReadOnly={false}
            isRequired={false}
          >
            <FormControlLabel mb="$1" justifyContent="space-between">
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>

            <Button
              onPress={async () => {
                const { error } = await supabase.auth.resetPasswordForEmail(
                  session?.user.email!,
                  {
                    redirectTo: `${process.env.EXPO_PUBLIC_WEB_APP_URL}/api/auth/callback?recovery=true`
                  }
                );

                if (error) {
                  toast(error.message, {
                    position: ToastPosition.BOTTOM
                  });
                  throw error;
                }
                toast("Password reset instructions sent to your email", {
                  position: ToastPosition.BOTTOM
                });
              }}
            >
              <ButtonText>Change Password</ButtonText>
            </Button>
            <FormControlHelper>
              <FormControlHelperText>
                Enter your current password to change it
              </FormControlHelperText>
            </FormControlHelper>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                At least 6 characters are required.
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <HStack>
            <Button
              action="negative"
              variant="link"
              onPress={() => {
                setShowDeleteModal(true);
              }}
            >
              <ButtonText>Delete Account</ButtonText>
            </Button>
          </HStack>
        </VStack>

        <AlertDialog
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
          }}
        >
          <AlertDialogBackdrop />
          <AlertDialogContent>
            <AlertDialogHeader>
              <Heading size="lg">Delete Account</Heading>
              <AlertDialogCloseButton>
                <Icon as={CloseIcon} />
              </AlertDialogCloseButton>
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text size="sm">
                Are you sure you want to delete your account? Your data will be
                permanently removed and cannot be undone.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <ButtonGroup space="lg">
                <Button
                  variant="outline"
                  action="secondary"
                  onPress={() => {
                    setShowDeleteModal(false);
                  }}
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                  bg="$error600"
                  action="negative"
                  onPress={async () => {
                    await deleteAccount();
                    setShowDeleteModal(false);
                  }}
                >
                  <ButtonText>Delete</ButtonText>
                </Button>
              </ButtonGroup>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
