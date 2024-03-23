import { Database } from "@fenamnow/types/database";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../helpers/supabase";

export type ChatContent = Database["public"]["Enums"]["message_type"] | string;

export const fetchChats = async (session: Session) => {
  const { data, error } = (await supabase
    .from("user_chats")
    .select("*")
    .eq("user_id", session.user.id)) as any;

  const receivers = await Promise.all(
    data.map(async (chat: any) => {
      const { data, error } = await supabase
        .from("user_chats")
        .select("*, user_id(id, full_name, avatar_url, type)")
        .eq("chat_id", chat.chat_id)
        .neq("user_id", session.user.id)
        .eq("blocked", false);
      return data;
    })
  );

  const chatsWithMessages = await Promise.all(
    receivers.flat().map(async (chat: any) => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chat.chat_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      return {
        ...chat,
        last_message: data
      };
    })
  );

  return chatsWithMessages;
};

export const fetchMessages = async ({
  chat_id,
  start = 0,
  end = 100
}: {
  chat_id: string;
  start?: number;
  end?: number;
}) => {
  const {
    data: messages,
    error,
    count
  } = await supabase
    .from("messages")
    .select("*", { count: "estimated" })
    .eq("chat_id", chat_id)
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) {
    console.error("Error fetching messages:", error);
    return { messages: null, error };
  }
  const hasNextPage = end! < count!;

  return { messages, error, count, hasNextPage };
};

export const sendMessage = async ({
  chat_id,
  sender_id,
  text,
  content_type
}: {
  chat_id: string;
  sender_id: string;
  text: string;
  content_type?: "text" | "image" | "video" | "audio" | "file" | "location";
}) => {
  const { data, error } = await supabase.from("messages").insert([
    {
      chat_id,
      sender_id,
      content: text,
      content_type: content_type || "text",
      is_edited: false
    }
  ]);

  if (error) {
    console.error("Error sending message:", error);
    return { data: null, error };
  }

  return { data, error: null };
};

export const findChat = async ({
  session,
  receiver_id
}: {
  session: Session;
  receiver_id: string;
}) => {
  return await supabase
    .from("chats")
    .select("*")
    .eq("receiver_id", receiver_id)
    .eq("user_id", session.user?.id)
    .or(`user_id.eq.${session.user?.id},receiver_id.eq.${receiver_id}`)
    .single();
};

export const findChatUserIds = async (id: string) => {
  return await supabase
    .from("chats")
    .select("receiver_id, user_id")
    .eq("id", id)
    .single();
};

export const createChat = async ({
  user_id,
  receiver_id
}: {
  user_id: string;
  receiver_id: string;
}) => {
  const { data, error } = await supabase
    .from("chats")
    .insert({
      user_id,
      receiver_id
    })
    .select();

  if (error) {
    console.error("Error creating chat:", error);
    return { data: null, error };
  }

  const { data: userChats, error: userChatsError } = await supabase
    .from("user_chats")
    .insert([
      {
        chat_id: data[0]?.id!,
        user_id
      },
      {
        chat_id: data[0]?.id!,
        user_id: receiver_id
      }
    ])
    .select();

  if (userChatsError) {
    console.error("Error creating user chats:", userChatsError);
    return { data: null, error: userChatsError };
  }

  return { data: userChats, error: null };
};

export const setMessagesToSeen = async ({
  chat_id,
  session
}: {
  chat_id: string;
  session: Session;
}) => {
  await supabase
    .from("messages")
    .update({
      seen: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("chat_id", chat_id)
    .neq("sender_id", session?.user?.id!)
    .is("seen", null)
    .select();
};

export const blockUser = async ({
  blocked_id,
  session
}: {
  blocked_id: string;
  session: Session;
}) => {
  return await supabase
    .from("blocked_users")
    .upsert({
      blocked_id,
      user_id: session?.user?.id!
    })
    .eq("user_id", session.user.id)
    .select()
    .single();
};
export const getOtherChatReciever = async ({
  user,
  chat_id
}: {
  user: Session["user"];
  chat_id: string;
}) => {
  const query = await supabase
    .from("user_chats")
    .select("id, chat_id, user_id(id, full_name, avatar_url)")
    .eq("chat_id", chat_id)
    .neq("user_id", user.id)
    .throwOnError()
    .single();
  return query;
};
export const blockChat = async ({
  user_id,
  chat_id
}: {
  user_id: string;
  chat_id: string;
}) => {
  return await supabase
    .from("user_chats")
    .update({ blocked: true })
    .eq("user_id", user_id)
    .eq("chat_id", chat_id)
    .select();
};
