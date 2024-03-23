import { Session } from "@supabase/supabase-js";
import { TypedSupabaseClient } from "../helpers/supabase/supabase";

export function getChats({
  client,
  user
}: {
  client: TypedSupabaseClient;
  user: Session["user"];
}) {
  const query = client
    .from("user_chats")
    .select("id, chat_id")
    .eq("user_id", user.id);
  return query;
}

export function getMessages({
  client,
  chat_id,
  start = 0,
  end = 20000
}: {
  client: TypedSupabaseClient;
  chat_id: string;
  start?: number;
  end?: number;
}) {
  const query = client
    .from("messages")
    .select("id, chat_id, content, content_type, sender_id, created_at, seen")
    .eq("chat_id", chat_id)
    .order("created_at");
  return query.throwOnError().range(start, end);
}

export function getOtherChatReciever({
  client,
  user,
  chat_id
}: {
  client: TypedSupabaseClient;
  user: Session["user"];
  chat_id: string;
}) {
  const query = client
    .from("user_chats")
    .select("id, chat_id, user_id(id, full_name, avatar_url)")
    .eq("chat_id", chat_id)
    .neq("user_id", user.id)
    .throwOnError()
    .single();
  return query;
}

export function getLastMessage({
  client,
  chat_id
}: {
  client: TypedSupabaseClient;
  chat_id: string;
}) {
  return client
    .from("messages")
    .select("id, seen, sender_id, content_type, content, created_at")
    .eq("chat_id", chat_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
}

export async function setMessagesToSeen({
  client,
  chat_id,
  user
}: {
  client: TypedSupabaseClient;
  chat_id: string;
  user: Session["user"];
}) {
  return await client
    .from("messages")
    .update({
      seen: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("chat_id", chat_id)
    .neq("sender_id", user.id)
    .is("seen", null);
}

export function findExistingChat({
  client,
  user,
  receiver_id
}: {
  client: TypedSupabaseClient;
  user: Session["user"];
  receiver_id: string;
}) {
  return client
    .from("chats")
    .select("*")
    .or(`user_id.eq.${user?.id},receiver_id.eq.${receiver_id}`)
    .single();
}

export async function createNewConversation({
  client,
  user,
  receiver_id
}: {
  client: TypedSupabaseClient;
  user: Session["user"];
  receiver_id: string;
}) {
  const res = await client
    .from("chats")
    .insert({ user_id: user.id, receiver_id })
    .select();
  const chatId = res?.data?.[0]?.id;
  if (chatId) {
    const receiverId = res?.data?.[0]?.receiver_id;
    if (receiverId) {
      return client
        .from("user_chats")
        .insert([
          {
            chat_id: chatId,
            user_id: user.id
          },
          {
            chat_id: chatId,
            user_id: receiverId
          }
        ])
        .select("id, chat_id, user_id(id, full_name, avatar_url)");
    }
  }
}
