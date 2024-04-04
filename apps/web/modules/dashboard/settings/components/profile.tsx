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
import { ImageCropper } from "@web/modules/property/components/image-cropper";
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

export default function ProfileSettings() {
  const { session } = useSession();
  const supabase = useSupabaseBrowser();
  const [editMode, setEditMode] = useState(false);
  const [newProfilePhoto, setNewProfilePhoto] = useState<
    File & {
      uri: string;
      alt: string;
    }
  >();
  const [loading, setLoading] = useState(false);
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);
  const [showCropper, setShowCropper] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      avatar_url: session?.user?.user_metadata?.avatar_url,
      full_name: session?.user?.user_metadata?.full_name,
      display_name: session?.user?.user_metadata?.display_name,
      website: session?.user?.user_metadata?.website
    }
  });

  const uploadNewAvatarUrl = async () => {
    try {
      setUploadingProfilePhoto(true);
      const { error } = await supabase.storage
        .from("avatars")
        .upload(
          `images/${session?.user.id}.${newProfilePhoto?.type.split("/")[1]}`,
          newProfilePhoto as File,
          {
            upsert: true
          }
        );
      if (error) throw error;
    } catch (error) {
      console.error(error);
      toast("Error encountered while uploading profile photo");
    } finally {
      setUploadingProfilePhoto(false);
    }
  };
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      form.formState.touchedFields.avatar_url && (await uploadNewAvatarUrl());
      const { error } = await supabase.auth.updateUser({
        data: { ...values }
      });
      if (error) throw error;
      toast("Profile updated successfully");
      form.clearErrors();
    } catch (error) {
      toast("Error encountered while updating profile");
    } finally {
      setLoading(false);
      setEditMode(false);
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

      setNewProfilePhoto(images[0]);
      form.setValue("avatar_url", images[0]?.uri, {
        shouldTouch: true,
        shouldDirty: true
      });
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onImagesDrop,
    accept: {
      "image/jpeg": [],
      "image/png": []
    },
    disabled: !editMode,
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
    maxFiles: 1,
    multiple: false,
    maxSize: 2 * 1024 * 1024
  });

  return (
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
                  <div className="flex flex-1 space-x-6">
                    <FormControl>
                      <div
                        {...getRootProps()}
                        className={cn(
                          "relative h-32 w-32 items-center justify-center rounded-full border-4",
                          editMode && "cursor-pointer hover:opacity-40",
                          uploadingProfilePhoto && "opacity-40"
                        )}
                      >
                        {uploadingProfilePhoto && (
                          <div className="absolute z-50 flex h-full w-full items-center justify-center">
                            <Loader2 className="h-12 w-12 animate-spin" />
                          </div>
                        )}
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
                                className="rounded-full object-cover"
                                fill
                              />
                            ) : (
                              <div className="absolute z-50 flex h-full w-full items-center justify-center">
                                <User className="h-16 w-16" />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </FormControl>
                    <div className="flex w-1/3 flex-col justify-between">
                      <FormDescription>
                        Photo should be a maximum of 2MB
                      </FormDescription>
                    </div>
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
  );
}
