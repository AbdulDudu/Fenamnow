import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@fenamnow/ui/components/ui/avatar";
import { Badge } from "@fenamnow/ui/components/ui/badge";
import { Button } from "@fenamnow/ui/components/ui/button";
import { Card, CardContent } from "@fenamnow/ui/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@fenamnow/ui/components/ui/dialog";
import { Label } from "@fenamnow/ui/components/ui/label";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@ui/lib/utils";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { useClientPublicUrls } from "@web/lib/hooks/use-client-public-url";
import { useSession } from "@web/modules/common/shared/providers/session";
import { MessageSquare, Play } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PropertyPoster({
  id,
  full_name,
  avatar_url,
  type,
  is_owner,
  video_tour,
  className
}: any) {
  const router = useRouter();
  const supabase = useSupabaseBrowser();
  const { session } = useSession();

  // const { data: existingChat } = useQuery(
  //   findExistingChat({
  //     client: supabase,
  //     user: session?.user,
  //     receiver_id: id
  //   })
  // );

  const videoURL = useClientPublicUrls(video_tour?.uri || "", "properties");

  return (
    <div className={cn("h-max w-1/3 space-y-4", className)}>
      <Label className="flex w-full items-center justify-between">
        Listed By{" "}
        {is_owner && <Badge className="font-bold">You posted this</Badge>}
      </Label>
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex w-full flex-col space-y-4">
            {/* Avatar, name */}
            <div className="flex w-full items-start space-x-4">
              <Avatar className="size-16">
                <AvatarImage src={avatar_url} alt={full_name} />
                <AvatarFallback>
                  {full_name?.split(" ").map((n: any) => n[0])}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold capitalize">{full_name}</p>
                <p className="text-sm capitalize opacity-55">{type}</p>
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex w-full flex-col items-center justify-between space-y-4 md:flex-row md:space-x-6 md:space-y-0">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full lg:w-auto"
                    disabled={videoURL == ""}
                  >
                    <Play className="mr-2" />
                    Watch video tour
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Video Tour</DialogTitle>
                  </DialogHeader>
                  <div>
                    <video src={videoURL as string} />
                  </div>
                </DialogContent>
              </Dialog>
              {/* {existingChat ? (
                <Button
                  onClick={() => router.push(`/chat/${existingChat?.id}`)}
                  className={cn("w-full lg:w-auto", is_owner && "hidden")}
                >
                  <MessageSquare className="mr-2" />
                  Continue chat
                </Button>
              ) : (
                <Button
                  onClick={() => createConversation()}
                  className={cn(
                    "w-full lg:w-auto",
                    (is_owner || !session) && "hidden"
                  )}
                >
                  <MessageSquare className="mr-2" />
                  Send a message
                </Button>
              )} */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
