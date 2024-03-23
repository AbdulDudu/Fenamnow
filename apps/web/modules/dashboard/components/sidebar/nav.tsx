"use client";

import { buttonVariants } from "@fenamnow/ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@fenamnow/ui/components/ui/tooltip";
import { cn } from "@ui/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    href: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-4 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-9 w-9",
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground hover:bg-muted dark:hover:text-white"
                  )}
                >
                  <link.icon className="size-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-background/50 text-foreground flex items-center gap-4"
              >
                {link.title}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={link.href}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" &&
                  "bg-muted text-foreground hover:bg-muted dark:text-white dark:hover:text-white",
                "justify-start"
              )}
            >
              <link.icon className="mr-4 size-4" />
              {link.title}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
