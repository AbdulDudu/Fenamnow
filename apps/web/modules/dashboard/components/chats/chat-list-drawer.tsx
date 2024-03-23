import { Button } from "@fenamnow/ui/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@fenamnow/ui/components/ui/drawer";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import ChatsList from "./list";

export function ChatListDrawer({ id }: { id: string }) {
  return (
    <Drawer>
      <DrawerTrigger asChild className="absolute bottom-32 left-0 sm:hidden">
        <Button size="icon" className="size-14 rounded-full">
          <EnvelopeClosedIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:hidden">
        <DrawerHeader className="text-left">
          <DrawerTitle>Chats</DrawerTitle>
        </DrawerHeader>
        <ChatsList id={id} className="h-[80vh] w-full px-4" />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
