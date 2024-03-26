import ChatsScreen from "@web/modules/dashboard/screens/chats";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chats | Fenamnow"
};
export default async function ChatPage() {
  return <ChatsScreen />;
}
