import { Database } from "@fenamnow/types/database";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export const dynamic = "force-dynamic";

const apiKey = process.env.NEXT_PUBLIC_GETSTREAM_API_KEY as string;
const apiSecret = process.env.GETSTREAM_API_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );

    const { data: userData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.id)
      .single();

    if (error) {
      return NextResponse.json({
        status: 500,
        message: "Error getting user data"
      });
    }
    const client = StreamChat.getInstance(apiKey, apiSecret);

    await client.upsertUser({
      id: userData.id,
      role: userData.type || "user",
      name: userData.full_name || "",
      avatar_url: userData.avatar_url
    });

    const token = client.createToken(data.id);

    // URL to redirect to after sign in process completes
    return NextResponse.json({
      token
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Error user getting token"
    });
  }
}
