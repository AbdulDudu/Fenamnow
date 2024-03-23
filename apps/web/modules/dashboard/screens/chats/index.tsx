import { Separator } from "@fenamnow/ui/components/ui/separator";
import { ChatListDrawer } from "../../components/chats/chat-list-drawer";
import ChatsList from "../../components/chats/list";
import ChatRoom from "../../components/chats/room";

export default function ChatsScreen({ id }: { id: string }) {
  return (
    <div className="flex size-full flex-col justify-between pt-2">
      <div className="relative flex h-[90%] flex-1 items-start">
        <ChatsList id={id} className="hidden sm:flex" />
        <Separator orientation="vertical" className="ml-4 hidden sm:flex" />
        <ChatRoom id={id} className="w-full sm:w-2/3" />
        <ChatListDrawer id={id} />
      </div>
    </div>
  );
}
