import { findProfileByEmail } from "@/lib/data/profile";
import { supabase } from "@/lib/helpers/supabase";
import { useSession } from "@/lib/providers/session";
import { GoogleIcon } from "@/modules/common/icons/brands/google";
import { Screen } from "@/modules/common/ui/screen";
import { toast, ToastPosition } from "@backpackapp-io/react-native-toast";
import {
  AlertCircleIcon,
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
  Center,
  Divider,
  EyeOffIcon,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  KeyboardAvoidingView,
  Spinner,
  Text,
  useColorMode,
  View,
  VStack
} from "@gluestack-ui/themed";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from "@react-native-google-signin/google-signin";
import { useMutation } from "@tanstack/react-query";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Linking from "expo-linking";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { capitalize } from "lodash";
import { EyeIcon } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, Platform, TextInput } from "react-native";
import { useDebounceValue } from "usehooks-ts";
import * as z from "zod";
import ForgotPasswordModal from "../components/forgot-password";

export default function AuthScreen() {
  const colorMode = useColorMode();
  const router = useRouter();
  const [type, setType] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, session, createSessionFromUrl } = useSession();
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_IOS_CLIENT_ID!,
    offlineAccess: true,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID!
  });

  const formSchema = z.object({
    full_name:
      type == "register"
        ? z.string().min(4, {
            message: "Full name must be at least 4 characters"
          })
        : z.string().optional(),
    email: z
      .string()
      .min(4, {
        message: "Email must be at least 4 characters"
      })
      .email({ message: "This is not a valid email" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
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
      full_name: "",
      email: "",
      password: ""
    }
  });

  const debouncedSearchTerm = useDebounceValue(watch("email"), 1000);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      Keyboard.dismiss();
      if (type == "register") {
        await register({
          email: data.email,
          password: data.password,
          full_name: data?.full_name!
        }).catch(e => {
          console.log(e);
          toast.error(`Error encountered during registeration`);
        });
      }
      if (type == "login") {
        await login({
          email: data.email,
          password: data.password
        }).then((res: any) => {
          if (res.error) {
            setError("email", { message: "Incorrect email or password" });
          }
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const { mutate: findProfileMutation, isPending } = useMutation({
    mutationFn: findProfileByEmail,
    onSuccess: async data => {
      if (!data.data) {
        clearErrors();
        return;
      }
      setError("email", { message: "Profile already exist" });
    },
    onError(error) {
      console.log(error);
    }
  });

  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);

  useEffect(() => {
    type == "register" &&
      debouncedSearchTerm[0].length > 0 &&
      findProfileMutation({ email: watch("email") as unknown as string });
  }, [debouncedSearchTerm[0]]);

  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  useEffect(() => {
    if (session) {
      router.replace("/(drawer)/(tabs)/home");
    }
  }, [session]);

  return (
    <Screen
      sx={{
        _dark: {
          backgroundColor: "$black"
        },
        _light: {
          backgroundColor: "$white"
        }
      }}
      justifyContent="center"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        height="60%"
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="$3xl" lineHeight="$3xl" semibold>
          {type == "register" && "Welcome to Fenamnow"}
          {type == "login" && "Welcome back"}
        </Text>
        <Text>
          {type == "register" && "Fill in the fields below to continue"}
          {type == "login" && "Sign in with email and password"}
        </Text>

        <VStack
          minHeight="$40"
          display="flex"
          space="sm"
          justifyContent="space-between"
          w="$full"
        >
          {/* Full name input */}
          {type == "register" && (
            <Controller
              name="full_name"
              control={control}
              rules={{ required: type == "register" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl
                  size="md"
                  isDisabled={false}
                  isInvalid={errors.full_name?.message != null}
                  isRequired={type == "register" && true}
                >
                  <FormControlLabel mb="$1">
                    <FormControlLabelText>Full name</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      type="text"
                      value={value}
                      onChangeText={onChange}
                      autoComplete="name"
                      returnKeyLabel="next"
                      returnKeyType="next"
                      onBlur={onBlur}
                      placeholder="John Doe"
                      onSubmitEditing={() => emailInputRef?.current?.focus()}
                    />
                  </Input>
                  <FormControlHelper></FormControlHelper>
                  <FormControlError>
                    <FormControlErrorText>
                      {errors.full_name?.message}
                    </FormControlErrorText>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                  </FormControlError>
                </FormControl>
              )}
            />
          )}
          {/* Email input */}
          <Controller
            control={control}
            name="email"
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
                    // @ts-ignore
                    ref={emailInputRef as any}
                    type="text"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    returnKeyLabel="next"
                    returnKeyType="next"
                    autoComplete="email"
                    onSubmitEditing={() => passwordInputRef?.current?.focus()}
                    autoCorrect={false}
                    placeholder="johndoe@email.com"
                  />
                  <InputSlot pr="$3">
                    {/* EyeIcon, EyeOffIcon are both imported from 'lucide-react-native' */}
                    {isPending && <Spinner />}
                  </InputSlot>
                </Input>
                <FormControlHelper></FormControlHelper>
                <FormControlError>
                  <FormControlErrorText>
                    {errors.email?.message}
                  </FormControlErrorText>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                </FormControlError>
              </FormControl>
            )}
          />
          {/* Password input */}
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl
                size="md"
                isDisabled={false}
                isInvalid={errors.password?.message != null}
                isRequired={true}
              >
                <FormControlLabel mb="$1">
                  <FormControlLabelText>Password</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  {type == "register" ? (
                    <InputField
                      // @ts-ignore
                      ref={passwordInputRef as any}
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoComplete="password-new"
                      autoCorrect={false}
                      onSubmitEditing={handleSubmit(onSubmit)}
                    />
                  ) : (
                    <InputField
                      // @ts-ignore
                      ref={passwordInputRef as any}
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoComplete="current-password"
                      autoCorrect={false}
                      onSubmitEditing={handleSubmit(onSubmit)}
                    />
                  )}
                  <InputSlot
                    pr="$3"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {/* EyeIcon, EyeOffIcon are both imported from 'lucide-react-native' */}
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                  </InputSlot>
                </Input>
                <FormControlHelper>
                  <FormControlHelperText>
                    Must be at least 6 characters.
                  </FormControlHelperText>
                </FormControlHelper>
                <FormControlError>
                  <FormControlErrorText>
                    {errors.password?.message}
                  </FormControlErrorText>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                </FormControlError>
              </FormControl>
            )}
          />

          {type === "login" && (
            <Button
              variant="link"
              p="$0"
              maxWidth={"$1/2"}
              justifyContent="flex-start"
              onPress={() => {
                setShowForgotPasswordModal(true);
              }}
            >
              <ButtonText>Forgot Password?</ButtonText>
            </Button>
          )}
        </VStack>

        <Button
          width="100%"
          isDisabled={loading}
          onPress={handleSubmit(onSubmit)}
        >
          {loading && <ButtonSpinner mr="$2" />}
          <ButtonText>{capitalize(type)}</ButtonText>
        </Button>
      </KeyboardAvoidingView>
      <Link
        style={{
          textAlign: "center",
          marginTop: 12,
          color: "#0e96f8",
          fontFamily: "NotoSans_600SemiBold",
          fontWeight: "600"
        }}
        href="/(drawer)/(tabs)/home"
      >
        Continue as guest
      </Link>
      <Center
        width="100%"
        display="flex"
        marginVertical="$5"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Divider width="40%" />
        <Text>or</Text>
        <Divider width="40%" />
      </Center>

      <Button
        width="100%"
        my="$1"
        backgroundColor="#DB4437"
        onPress={async () => {
          try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            if (userInfo.idToken) {
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: userInfo.idToken
              });

              if (error) {
                throw error;
              }
            } else {
              throw new Error("no ID token present!");
            }
          } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            } else {
              console.log(error);
              // some other error happened
              toast.error("Error signing in with google");
            }
          }
        }}
      >
        <ButtonIcon mr="$1.5" as={GoogleIcon} />
        <ButtonText color="$white">
          {type == "login" ? "Sign in" : "Sign up"} with Google
        </ButtonText>
      </Button>

      {Platform.OS === "ios" && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={
            type == "login"
              ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              : AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP
          }
          buttonStyle={
            colorMode == "dark"
              ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE
              : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
          }
          cornerRadius={5}
          style={{ maxWidth: "100%", height: 42, marginVertical: 4 }}
          onPress={async () => {
            try {
              const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                  AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                  AppleAuthentication.AppleAuthenticationScope.EMAIL
                ]
              });
              // Sign in via Supabase Auth.
              if (credential.identityToken) {
                const {
                  error,
                  data: { user }
                } = await supabase.auth.signInWithIdToken({
                  provider: "apple",
                  token: credential.identityToken
                });

                console.log(user);
                if (!error) {
                  // User is signed in.
                }
              } else {
                throw new Error("No identityToken.");
              }
            } catch (e: any) {
              if (e.code === "ERR_REQUEST_CANCELED") {
                toast("Sign in with apple cancelled", {
                  position: ToastPosition.BOTTOM
                });
              } else {
                toast("Error signing in with apple", {
                  position: ToastPosition.BOTTOM
                });
              }
            }
          }}
        />
      )}

      <View
        display="flex"
        justifyContent="center"
        flexDirection="row"
        alignItems="center"
        marginTop="$1"
      >
        {type == "login" && (
          <>
            <Text>Don't have an account? </Text>
            <Button
              variant="link"
              onPress={() => {
                setType("register");
                clearErrors();
              }}
            >
              <ButtonText>Register</ButtonText>
            </Button>
          </>
        )}
        {type == "register" && (
          <>
            <Text>Already have an account? </Text>
            <Button
              variant="link"
              onPress={() => {
                setType("login");
                clearErrors();
              }}
            >
              <ButtonText>Login</ButtonText>
            </Button>
          </>
        )}
      </View>
      <ForgotPasswordModal
        showForgotPasswordModal={showForgotPasswordModal}
        setShowForgotPasswordModal={setShowForgotPasswordModal}
      />
    </Screen>
  );
}
