"use client";

import { Button } from "@fenamnow/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@fenamnow/ui/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@fenamnow/ui/components/ui/form";
import { Input } from "@fenamnow/ui/components/ui/input";
import { cn } from "@fenamnow/ui/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { useSession } from "@web/modules/common/shared/providers/session";
import { PublicImage } from "@web/modules/property/components/images";
import { Loader2, User } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ReactDropzone, {
  DropEvent,
  FileRejection,
  useDropzone
} from "react-dropzone";
import { useForm } from "react-hook-form";
import ReactCrop from "react-image-crop";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  avatar_url: z.string().optional(),
  full_name: z.string().min(5).max(50),
  display_name: z.string().min(4).max(50).optional(),
  website: z.string().url({ message: "Url isn't valid" }).optional()
});

export default function ProfileScreen() {
  const { session } = useSession();
  const supabase = useSupabaseBrowser();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      avatar_url: session?.user?.user_metadata?.avatar_url,
      full_name: session?.user?.user_metadata?.full_name,
      display_name: session?.user?.user_metadata?.display_name,
      website: session?.user?.user_metadata?.website
    }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        data: { ...values }
      });
      if (error) throw error;
      toast("Profile updated successfully");
      setEditMode(false);
      form.clearErrors();
    } catch (error) {
      toast("Error encountered while updating profile");
    } finally {
      setLoading(false);
    }
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

  const onImagesDrop = useCallback(
    (acceptedFiles: File[]) => {
      const images = acceptedFiles.map(file =>
        Object.assign(file, {
          uri: URL.createObjectURL(file),
          alt: ""
        })
      );
    },
    [form]
  );

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop: onImagesDrop,
    accept: {
      "image/jpeg": [],
      "image/png": []
    },
    onDropRejected: (fileRejections: FileRejection[], event: DropEvent) => {
      fileRejections.map(fileRejection => {
        fileRejection.errors.map(error => {
          switch (error.code) {
            case "file-too-large":
              toast("File is too large");
              break;
            case "file-invalid-type":
              toast("File type is invalid");
              break;
            default:
              return;
          }
        });
      });
    },
    maxFiles: 10,
    multiple: true,
    maxSize: 2 * 1024 * 1024
  });

  return (
    <div className="container flex size-full flex-col justify-between pt-2">
      <div className="flex h-[90%] flex-1 flex-col items-center justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-[540px]">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Details about your profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile photo input */}
                <FormField
                  control={form.control}
                  name="avatar_url"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Profile Photo</FormLabel>
                      <div className="flex size-32 flex-col space-x-6">
                        <FormControl>
                          <div
                            {...getRootProps()}
                            className="relative flex size-full cursor-pointer items-center justify-center rounded-full border-4"
                          >
                            <input
                              {...getInputProps({
                                accept: "image/*"
                              })}
                            />
                            {!isDragActive && (
                              <>
                                {field.value ? (
                                  <PublicImage
                                    path={field.value}
                                    bucket="avatars"
                                    alt={session.user.user_metadata.full_name}
                                    className="rounded-full"
                                    fill
                                  />
                                ) : (
                                  <User className="h-16 w-16" />
                                )}
                              </>
                            )}
                          </div>
                        </FormControl>
                        {/* <div className="flex flex-col justify-between gap-y-2">
                          <FormDescription>
                            Photo should be a maximum of 2MB and should be a
                            minimum of 320px by 320px
                          </FormDescription>
                        </div> */}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input
                          required
                          disabled={!editMode}
                          placeholder="Enter your full name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="display_name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Display name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!editMode}
                          placeholder="Enter your display name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Users will see this instead of your full name
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!editMode}
                          type="url"
                          placeholder="Enter your website"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                {editMode ? (
                  <div className="flex items-center space-x-6">
                    <Button
                      type="submit"
                      disabled={!form.formState.isDirty || loading}
                    >
                      {loading && <Loader2 className="mr-2 animate-spin" />}
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        form.clearErrors();
                        setEditMode(false);
                      }}
                      variant="destructive"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex w-full items-center justify-between">
                    <Button onClick={() => setEditMode(true)}>Edit</Button>

                    {agentApplicationData?.data ? (
                      <p
                        className={cn(
                          "font-semibold capitalize text-orange-300",
                          agentApplicationData?.data?.status == "approved" &&
                            "text-green-500",
                          agentApplicationData?.data?.status == "declined" &&
                            "text-red-500"
                        )}
                      >
                        {agentApplicationData?.data?.status == "approved" &&
                          "Verified"}
                      </p>
                    ) : (
                      <Button variant="link" type="button" asChild>
                        <Link href="/agent-verification">Become an agent</Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
