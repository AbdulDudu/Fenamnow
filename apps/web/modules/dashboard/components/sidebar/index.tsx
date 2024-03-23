"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@fenamnow/ui/components/ui/resizable";
import { TooltipProvider } from "@fenamnow/ui/components/ui/tooltip";
import { cn } from "@ui/lib/utils";
import {
  File,
  HelpCircle,
  Home,
  MessageSquare,
  Settings,
  Shield,
  User
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Nav } from "./nav";

export default function Sidebar({
  defaultLayout = [265, 440, 655],
  defaultCollapsed = true,
  navCollapsedSize,
  children
}: {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const pathname = usePathname();
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="min-h-screen pt-14"
        direction="horizontal"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div className="container flex h-full flex-col justify-between">
            <Nav
              isCollapsed={isCollapsed}
              links={[
                // {
                //   title: "Dashboard",
                //   href: "/dashboard",
                //   variant: pathname.startsWith("/dashboard")
                //     ? "default"
                //     : "ghost",
                //   icon: Gauge
                // },
                {
                  title: "Properties",
                  href: "/properties",
                  variant: pathname.startsWith("/properties")
                    ? "default"
                    : "ghost",
                  icon: Home
                },
                {
                  title: "Chats",
                  href: "/chats",
                  variant: pathname.startsWith("/chats") ? "default" : "ghost",
                  icon: MessageSquare
                }
              ]}
            />

            <div>
              <Nav
                isCollapsed={isCollapsed}
                links={[
                  {
                    title: "Profile",
                    href: "/profile",
                    variant: pathname.startsWith("/profile")
                      ? "default"
                      : "ghost",
                    icon: User
                  },
                  {
                    title: "Settings",
                    href: "/settings",
                    variant: pathname.startsWith("/settings")
                      ? "default"
                      : "ghost",
                    icon: Settings
                  },
                  {
                    title: "Privacy policy",
                    href: "/legal/privacy-policy",
                    variant: "ghost",
                    icon: Shield
                  },
                  {
                    title: "Terms of service",
                    href: "/legal/terms-of-service",
                    variant: "ghost",
                    icon: File
                  },
                  {
                    title: "Help & Support",
                    href: "/support",
                    variant: "ghost",
                    icon: HelpCircle
                  }
                ]}
              />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="hidden sm:flex" />
        <ResizablePanel
          className={cn(
            "max-h-full",
            pathname.startsWith("/chats") && "container"
          )}
        >
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
