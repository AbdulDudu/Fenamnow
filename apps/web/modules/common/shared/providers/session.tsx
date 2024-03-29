"use client";

import { Session } from "@supabase/auth-helpers-nextjs";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { useRouter } from "next/navigation";
import { createContext, useContext } from "react";

type SessionContext = {
  session: Session;
  logOut: () => Promise<void>;
};
const SessionContext = createContext({} as SessionContext);

export const SessionProvider = ({ children, session }: any) => {
  const supabase = useSupabaseBrowser();
  const router = useRouter();
  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    router.refresh();
  };
  return (
    <SessionContext.Provider value={{ session, logOut }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};
