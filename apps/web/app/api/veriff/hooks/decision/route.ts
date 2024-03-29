import { Database } from "@fenamnow/types/database";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    console.log("Decision webhook response", body);

    if (!body.verification) {
      return NextResponse.json({
        status: 500
      });
    }

    await supabase
      .from("agent_applications")
      .update({
        status: body.verification.status
      })
      .eq("veriff_id", body.verification.id)
      .select()
      .single()
      .then(async response => {
        if (response.data?.status == "approved") {
          return await supabase
            .from("profiles")
            .update({
              type: "agent"
            })
            .eq("id", response?.data?.user_id!)
            .select()
            .single()
            .then(
              async response =>
                await supabase.auth.admin.updateUserById(
                  body.verification.userId,
                  {
                    user_metadata: {
                      type: response.data?.type
                    }
                  }
                )
            );
        }

        if (response.data?.status == "declined") {
          return await supabase.auth.admin.updateUserById(
            response.data.user_id!,
            {
              user_metadata: {
                type: "user"
              }
            }
          );
        }
      });

    return NextResponse.json({
      status: 200
    });
  } catch (error) {
    return NextResponse.json({
      status: 500
    });
  }
}
