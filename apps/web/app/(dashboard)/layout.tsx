import useSupabaseServer from "@web/lib/helpers/supabase/server-client";
import Navbar from "@web/modules/common/shared/navbar";
import { SessionProvider } from "@web/modules/common/shared/providers/session";
import Sidebar from "@web/modules/dashboard/components/sidebar";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true
  }
};
export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = useSupabaseServer(cookieStore);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const layout = cookieStore?.get("react-resizable-panels:layout");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  if (!session) {
    redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      <Navbar isDashboard />
      <Sidebar defaultLayout={defaultLayout} navCollapsedSize={4}>
        {children}
      </Sidebar>
    </SessionProvider>
  );
}
