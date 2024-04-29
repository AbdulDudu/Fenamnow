import Storage from "@/lib/utils/storage";
import { toast, ToastPosition } from "@backpackapp-io/react-native-toast";
import {
  AuthError,
  AuthTokenResponse,
  Provider,
  Session
} from "@supabase/supabase-js";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { useRouter } from "expo-router";
import React, { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { QuickSqliteClient } from "stream-chat-expo";
import { createChatToken } from "../data/chat";
import { getStreamChatClient } from "../helpers/getstream";
import { supabase } from "../helpers/supabase";

type OAuthUrlType = {
  access_token?: string | null;
  expires_in?: number | null;
  refresh_token?: string | null;
  token_type?: string | null;
  provider_token?: string | null;
};

type SessionContextProps = {
  session: Session | null | undefined;
  showScreens: boolean | null;
  login: ({
    email,
    password
  }: {
    email: string;
    password: string;
  }) => Promise<AuthTokenResponse>;
  register: ({
    email,
    full_name,
    password
  }: {
    email: string;
    full_name: string;
    password: string;
  }) => Promise<AuthError | undefined>;
  logout: () => Promise<void>;
  resetPassword: (new_password: string) => Promise<void>;
  extractParamsFromUrl: (url: string) => OAuthUrlType;
  createSessionFromUrl: (url: string) => Promise<Session | null | undefined>;
  getOAuthUrl: ({ provider }: { provider: Provider }) => Promise<{
    url: string | null;
  }>;
  deleteAccount: () => Promise<void>;
};

export const SessionContext = createContext({} as SessionContextProps);
export const SessionProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const redirectTo = makeRedirectUri();

  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [showScreens, setShowScreens] = useState<boolean | null>(null);

  const extractParamsFromUrl = (url: string): OAuthUrlType => {
    const params = new URLSearchParams(url.split("#")[1]);
    const data = {
      access_token: params.get("access_token"),
      expires_in: parseInt(params.get("expires_in") || "0"),
      refresh_token: params.get("refresh_token"),
      token_type: params.get("token_type"),
      provider_token: params.get("provider_token")
    };

    return data;
  };

  const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);

    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token } = params;

    if (!access_token) return;

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token: refresh_token!
    });
    if (error) throw error;
    return data.session;
  };
  const login = async ({
    email,
    password
  }: {
    email: string;
    password: string;
  }) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  };

  const register = async ({
    email,
    full_name,
    password
  }: {
    email: string;
    full_name: string;
    password: string;
  }) => {
    const redirectTo = makeRedirectUri();
    const { error, data } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name
        }
      }
    });

    if (error) return error;

    await createChatToken(data?.user?.id!);

    toast("A confirmation email has been sent", {
      position: ToastPosition.BOTTOM
    });
  };

  const getOAuthUrl = async ({
    provider
  }: {
    provider: Provider;
  }): Promise<{
    url: string | null;
  }> => {
    const result = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo
      }
    });

    return result.data;
  };

  const setOAuthSession = async (tokens: {
    access_token: string;
    refresh_token: string;
  }) => {
    try {
      const { error } = await supabase.auth.setSession({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token
      });

      if (error) throw error;
    } catch (error: any) {
      toast(error.message, {
        duration: 3000
      });
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ fcm_token: "" })
        .eq("id", {
          id: session?.user.id
        });
      if (error) {
        throw error;
      }

      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) throw logoutError;

      Storage.removeItem("chat_token");
      QuickSqliteClient.resetDB();
      getStreamChatClient.disconnectUser();
    } catch (error) {
      toast.error("Error logging out user");
    }
  };

  const resetPassword = async (new_password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: new_password
    });

    if (!error) {
      return Alert.alert(
        "Password Changed",
        "Your password has been changed successfully",
        [
          {
            text: "OK",
            onPress: () => router.push("/(drawer)/(tabs)/home")
          }
        ]
      );
    }
    console.log(error);
  };

  const deleteAccount = async () => {
    const { error } = await supabase.functions.invoke("delete_user_account");
    if (!error) {
      await logout();
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === "SIGNED_IN") {
        router.replace("/(drawer)/(tabs)/home");
      }

      if (event === "SIGNED_OUT") {
        router.replace("/(auth)/");
      }
    });
    setShowScreens(true);
  }, [showScreens]);

  return (
    <SessionContext.Provider
      value={{
        session,
        showScreens,
        extractParamsFromUrl,
        getOAuthUrl,
        login,
        createSessionFromUrl,
        register,
        logout,
        resetPassword,
        deleteAccount
      }}
    >
      {showScreens && children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return React.useContext(SessionContext);
};
