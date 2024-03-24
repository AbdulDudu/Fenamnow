import "@fenamnow/ui/globals.css";
import { TailwindIndicator } from "@fenamnow/ui/components/ui/tailwind-indicator";
import { ThemeProvider } from "@fenamnow/ui/components/ui/theme-provider";
import { cn } from "@fenamnow/ui/lib/utils";
import { ReactQueryClientProvider } from "@web/modules/common/shared/providers/query";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
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

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn("min-h-screen font-sans antialiased", inter.variable)}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors expand />
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
