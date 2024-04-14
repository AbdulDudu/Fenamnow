import "@fenamnow/ui/globals.css";
import { TailwindIndicator } from "@fenamnow/ui/components/ui/tailwind-indicator";
import { ThemeProvider } from "@fenamnow/ui/components/ui/theme-provider";
import { cn } from "@fenamnow/ui/lib/utils";
import { GoogleTagManager } from "@next/third-parties/google";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import useSupabaseServer from "@web/lib/helpers/supabase/server-client";
import { ChatProvider } from "@web/modules/common/shared/providers/chat";
import { ReactQueryClientProvider } from "@web/modules/common/shared/providers/query";
import { SessionProvider } from "@web/modules/common/shared/providers/session";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { Toaster } from "sonner";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans"
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: "Fenamnow",
  description: "Easy search, easy find with fenamnow",
  openGraph: {
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "Fenamnow",
    description: "Easy search, easy find with fenamnow",
    siteName: "Fenamnow",
    images: [
      {
        url: "/og-image.png"
      }
    ]
  },
  itunes: {
    appId: "6472881076"
  }
};

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
    <ReactQueryClientProvider>
      <html lang="en" suppressHydrationWarning>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
        <body
          className={cn(
            "min-h-screen w-full font-sans antialiased",
            notoSans.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SessionProvider session={session}>
              <ChatProvider>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
              </ChatProvider>
            </SessionProvider>
            <Toaster richColors expand />
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
