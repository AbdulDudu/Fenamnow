import { Session } from "@supabase/supabase-js";
import { chatClient } from "../helpers/chat";

export const createChatToken = async (id: Session["user"]["id"]) => {
  return await fetch(`${process.env.EXPO_PUBLIC_WEB_APP_URL}/api/chat/token`, {
    method: "POST",
    body: JSON.stringify({ id })
  }).then(async res => await res.json());
};

export const findChatChannel = async ({
  id,
  owner_id
}: {
  id: Session["user"]["id"];
  owner_id: string;
}) => {
  return await chatClient.queryUsers({
    id: { $in: [id, owner_id] }
  });
};
