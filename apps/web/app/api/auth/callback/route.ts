import { createClient } from "@web/lib/helpers/supabase/server-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const recovery = requestUrl.searchParams.get("recovery")
    ? "/reset-password"
    : "/";
  const redirectTo = requestUrl.searchParams.get("redirectTo");
  const callbackUrl = requestUrl.searchParams.get("callbackUrl");
  if (code) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (callbackUrl) {
    return NextResponse.redirect(requestUrl.origin + callbackUrl);
  }
  if (redirectTo) {
    return NextResponse.redirect(requestUrl.origin + redirectTo);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + recovery);
}
