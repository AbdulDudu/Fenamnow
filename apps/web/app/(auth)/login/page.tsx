import useSupabaseServer from "@web/lib/helpers/supabase/server-client";
import AuthScreen from "@web/modules/auth/screens";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const cookieStore = cookies();
  const supabase = useSupabaseServer(cookieStore);

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }
  return <AuthScreen path="/login" />;
}
