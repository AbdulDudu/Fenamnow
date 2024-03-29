import { Session } from "@supabase/supabase-js";

export const createChatToken = async (id: Session["user"]["id"]) => {
  return await fetch(`api/chat/token`, {
    method: "POST",
    body: JSON.stringify({ id })
  }).then(async res => await res.json());
};
