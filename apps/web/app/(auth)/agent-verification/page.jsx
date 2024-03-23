"use client";

import { Button } from "@fenamnow/ui/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { MESSAGES } from "@veriff/incontext-sdk";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { useSession } from "@web/modules/common/shared/providers/session";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { toast } from "sonner";

export default function AgentVerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const supabase = useSupabaseBrowser();
  const { session } = useSession();

  const isMobile = searchParams.get("mobile");

  if (!session) {
    return router.replace(
      isMobile == "true"
        ? "/login?redirectTo=/agent-verification%3Fmobile%3Dtrue"
        : "/login?redirectTo=/agent-verification"
    );
  }

  const { data: agentApplicationData, error } = useQuery({
    queryKey: [session],
    queryFn: async () => {
      return await supabase
        .from("agent_applications")
        .select("*")
        .eq("user_id", session.user.id)
        .single();
    },
    enabled: !!session
  });

  return (
    <>
      <Script src="https://cdn.veriff.me/sdk/js/1.5/veriff.min.js" />

      <Script
        src="https://cdn.veriff.me/incontext/js/v1/veriff.js"
        onReady={() => {
          const veriff = Veriff({
            host: process.env.NEXT_PUBLIC_VERIFF_HOST,
            apiKey: process.env.NEXT_PUBLIC_VERIFF_API_KEY,
            parentId: "veriff-root",
            onSession: async function (err, response) {
              if (response.status == "success") {
                if (response.verification.status === "created") {
                  await supabase.from("agent_applications").insert({
                    user_id: session.user.id,
                    veriff_id: response.verification.id,
                    status: response.verification.status,
                    url: response.verification.url
                  });
                  window.veriffSDK.createVeriffFrame({
                    url: response.verification.url,
                    onEvent: function (message) {
                      switch (message) {
                        case MESSAGES.FINISHED:
                          isMobile
                            ? window.ReactNativeWebView.postMessage(
                                "Your documents were submitted successfully"
                              )
                            : toast(
                                "Your documents were submitted successfully",
                                {
                                  duration: 3000,
                                  onAutoClose: router.replace("/profile")
                                }
                              );
                          break;
                        default:
                          return;
                      }
                    }
                  });
                }
              }
              console.log(response);
            }
          });
          veriff.setParams({
            person: {
              givenName: " ",
              lastName: " "
            },
            vendorData: " "
          });
          veriff.mount();
        }}
      />

      <div className="container flex h-screen w-full flex-col items-center justify-center">
        {agentApplicationData?.data && (
          <div className="flex w-[400px] flex-col items-center space-y-6">
            <p className="text-3xl font-semibold">
              We're verifying your identity. We'll reach out to you if we need
              any extra information.
            </p>
            <Button asChild>
              <Link href="/profile">Go back</Link>
            </Button>
          </div>
        )}
        {!agentApplicationData?.data && <div id="veriff-root"></div>}
      </div>
    </>
  );
}
