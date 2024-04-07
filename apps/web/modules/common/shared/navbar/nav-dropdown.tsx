import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@fenamnow/ui/components/ui/avatar";
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
import { useTheme } from "next-themes";
import Link from "next/link";
import { SlLogout } from "react-icons/sl";
import { useSession } from "../providers/session";

export function NavDropdown() {
  const { logOut, session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Avatar className="size-6">
            <AvatarImage
              src={session?.user.user_metadata.avatar_url}
              alt={session?.user.user_metadata.full_name}
            />
            <AvatarFallback>
              {session?.user.user_metadata.full_name
                ?.split(" ")
                .map((n: string) => n[0])}
            </AvatarFallback>
          </Avatar>
          <span className="ml-2">
            {session?.user.user_metadata.full_name?.split(" ")[0]}
          </span>
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
