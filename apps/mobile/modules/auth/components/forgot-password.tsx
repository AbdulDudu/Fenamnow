import { findProfileByEmail } from "@/lib/data/profile";
import { supabase } from "@/lib/helpers/supabase";
import { AnimatedView } from "@/modules/common/ui/animated-view";
import { toast, ToastPosition } from "@backpackapp-io/react-native-toast";
import {
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  Input,
  InputField,
  InputSlot,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  styled,
  Text,
  VStack
} from "@gluestack-ui/themed";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { makeRedirectUri } from "expo-auth-session";
import { useRouter } from "expo-router";
import { AlertCircleIcon } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { useDebounce } from "usehooks-ts";
import * as z from "zod";

export default function ForgotPasswordModal({
  showForgotPasswordModal,
  setShowForgotPasswordModal
}: any) {
  const [intervalValue, _setIntervalValue] = useState<number>(1000);

  const [profileFound, setProfileFound] = useState<boolean | null>(null);
  const ref = useRef(null);

  const formSchema = z.object({
    email: z
      .string()
      .min(4, {
        message: "Email must be at least 4 characters"
      })
      .email({ message: "This is not a valid email" })
  });

  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    watch,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  });

  const debouncedSearchTerm = useDebounce(watch("email"), 1000);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: findProfileByEmail,
    onSuccess: async data => {
      if (!data.data) {
        control.setError("email", {
          message: "Profile doesn't exist"
        });
        setProfileFound(false);
        return;
      }
      if (errors) {
        setProfileFound(true);
        clearErrors();
      }
    },
    onError(error) {
      console.log(error);
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.EXPO_PUBLIC_WEB_APP_URL}/api/auth/callback?recovery=true`
    });
    if (error) {
      console.log(error);
      throw error;
    }
    Keyboard.dismiss();
    setShowForgotPasswordModal(false);
    toast("Password reset instructions sent to your email", {
      duration: 3000,
      position: ToastPosition.BOTTOM
    });
  };

  useEffect(() => {
    debouncedSearchTerm && mutate({ email: debouncedSearchTerm });
  }, [debouncedSearchTerm]);

  return (
    <Modal
      avoidKeyboard
      isOpen={showForgotPasswordModal}
      onClose={() => {
        setShowForgotPasswordModal(false);
      }}
      finalFocusRef={ref}
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <VStack space="md">
            <Text fontFamily="Inter_700Bold" fontSize="$xl">
              Forgot your password?
            </Text>

            <Text fontSize="$md">
              No worries, we'll send you instructions on how to fix that
            </Text>
          </VStack>
        </ModalHeader>
        <ModalBody>
          <AnimatedView>
            <VStack display="flex" justifyContent="space-around">
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormControl
                    size="md"
                    isDisabled={false}
                    isInvalid={errors.email?.message != null}
                    isRequired={true}
                  >
                    <FormControlLabel mb="$1">
                      <FormControlLabelText>Email</FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                      <InputField
                        type="text"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect={false}
                        placeholder="johndoe@email.com"
                      />
                      <InputSlot pr="$3">{isPending && <Spinner />}</InputSlot>
                    </Input>

                    <FormControlError>
                      <FormControlErrorText>
                        {errors.email?.message}
                      </FormControlErrorText>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                    </FormControlError>
                  </FormControl>
                )}
              />
            </VStack>
          </AnimatedView>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            size="sm"
            action="secondary"
            mr="$3"
            onPress={() => {
              setShowForgotPasswordModal(false);
            }}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>

          <Button
            size="sm"
            isDisabled={!profileFound || errors.email?.message != null}
            borderWidth="$0"
            onPress={handleSubmit(onSubmit)}
          >
            <ButtonText>Send Link</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
