import { Badge } from "@fenamnow/ui/components/ui/badge";
import { Button } from "@fenamnow/ui/components/ui/button";
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  Share1Icon
} from "@radix-ui/react-icons";
import { Session } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@ui/lib/utils";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { useSession } from "@web/modules/common/shared/providers/session";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import ShareButton from "./share";

export default function PropertyAddressHeader({ property }: { property: any }) {
  const supabase = useSupabaseBrowser();
  const { session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: favourite, refetch } = useQuery({
    queryKey: ["favourite", property.id],
    staleTime: 500,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favourites")
        .select("*")
        .eq("property_id", property.id)
        .eq("user_id", session?.user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!session
  });

  const { mutateAsync: save } = useMutation({
    mutationFn: async (data: any) => {
      const { data: favourite, error } = await supabase
        .from("favourites")
        .upsert(data)
        .select()
        .single();
      if (error) throw error;
      return favourite;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["favourite", property.id]
      });
      toast.success("Property saved successfully");
    }
  });

  const { mutateAsync: unsave } = useMutation({
    mutationFn: async (data: {
      property_id: number;
      user_id: Session["user"]["id"];
    }) => {
      const { data: favourite, error } = await supabase
        .from("favourites")
        .delete()
        .eq("property_id", data.property_id)
        .eq("user_id", data.user_id);
      if (error) throw error;
      window.location.reload();
      return favourite;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["favourite", property.id]
      });
      toast.success("Property unsaved successfully");
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  console.log(favourite);

  return (
    <div className="flex min-h-32 w-full items-end justify-between">
      {/* Address and price */}
      <div className="max-w-1/2 flex h-full flex-col justify-end">
        <h3>{property?.city}</h3>
        <p>
          {property?.community}, {property?.address}
        </p>
        <p className="text-xl font-bold">
          ${property?.price?.toLocaleString("en-GB")}
          {property?.lease_duration && (
            <span className="ml-1 text-sm font-semibold opacity-75">
              /{property?.lease_duration}
            </span>
          )}
        </p>
      </div>
      {/* Action buttons and property type */}
      <div className="max-w-1/2 flex h-full flex-col items-end justify-between md:items-start">
        <Badge variant="outline" className="my-6 max-w-max capitalize">
          {property?.property_type}
        </Badge>
        <div className="flex justify-end space-x-6">
          <ShareButton id={property.id} />
          <Button
            className={cn(!session && "hidden")}
            variant={
              favourite?.property_id == property.id ? "secondary" : "outline"
            }
            onClick={() => {
              if (session) {
                if (favourite?.property_id == property.id) {
                  unsave({
                    property_id: property.id,
                    user_id: session.user.id
                  });
                } else {
                  save({
                    property_id: property.id,
                    user_id: session.user.id
                  });
                }
              } else {
                toast.error("You need to be logged in to save a property");
              }
            }}
          >
            {favourite?.property_id == property.id ? (
              <>
                <BookmarkFilledIcon />
                <span className="ml-2">Saved</span>
              </>
            ) : (
              <>
                <BookmarkIcon />
                <span className="ml-2">Save</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
