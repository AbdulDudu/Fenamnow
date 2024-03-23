import useSupabaseServer from "@web/lib/helpers/supabase/server-client";
import { SessionProvider } from "@web/modules/common/shared/providers/session";
import { cookies } from "next/headers";

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = useSupabaseServer(cookieStore);

  const {
    data: { session }
  } = await supabase.auth.getSession();

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
