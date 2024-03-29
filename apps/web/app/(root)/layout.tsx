import useSupabaseServer from "@web/lib/helpers/supabase/server-client";
import Footer from "@web/modules/common/shared/footer";
import Navbar from "@web/modules/common/shared/navbar";
import { ChatProvider } from "@web/modules/common/shared/providers/chat";
import { SessionProvider } from "@web/modules/common/shared/providers/session";
import { cookies } from "next/headers";

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = useSupabaseServer(cookieStore);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
