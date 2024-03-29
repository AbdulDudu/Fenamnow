import { Session } from "@supabase/supabase-js";
import { getStreamChatClient } from "../helpers/getstream";

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
  return await getStreamChatClient.queryUsers({
    id: { $in: [id, owner_id] }
  });
};
