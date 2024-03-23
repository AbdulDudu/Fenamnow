import { NextRequest, NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export const dynamic = "force-dynamic";

const apiKey = process.env.NEXT_PUBLIC_GETSTREAM_API_KEY as string;
const apiSecret = process.env.GETSTREAM_API_SECRET as string;

export async function GET(req: NextRequest) {
  try {
    const data = await req.json();

    const client = StreamChat.getInstance(apiKey, apiSecret);

    // 3 generate a user token
    const upsertResponse = await client.upsertUser({
      id: data.id,
      role: "user"
    });

    const token = client.createToken(data.id);

    // URL to redirect to after sign in process completes
    return NextResponse.json({
      token,
      data: upsertResponse
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Error user getting token"
    });
  }
}
