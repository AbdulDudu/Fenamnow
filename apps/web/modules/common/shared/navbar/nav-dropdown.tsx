import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@fenamnow/ui/components/ui/avatar";
import { Badge } from "@fenamnow/ui/components/ui/badge";
import { Button } from "@fenamnow/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@fenamnow/ui/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { getStreamChatClient } from "@web/lib/helpers/chat";
import { createChatToken } from "@web/lib/queries/chats";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SlLogout } from "react-icons/sl";
import { useSession } from "../providers/session";

type Props = {
  metadata: {
    email?: string;
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
};
export function NavDropdown({ metadata }: Props) {
  const { logOut, session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Avatar className="size-6">
            <AvatarImage src={metadata.avatar_url} alt={metadata.full_name} />
            <AvatarFallback>
              {metadata.full_name?.split(" ").map(n => n[0])}
            </AvatarFallback>
          </Avatar>
          <span className="ml-2">{metadata.full_name?.split(" ")[0]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/properties">Properties</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/chat">Chat</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuItem className="text-destructive" onClick={logOut}>
          <SlLogout className="mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
