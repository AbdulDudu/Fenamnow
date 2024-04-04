import ChatsScreen from "@web/modules/dashboard/chat/screens";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chats | Fenamnow"
};
export default async function ChatPage() {
  return <ChatsScreen />;
}
