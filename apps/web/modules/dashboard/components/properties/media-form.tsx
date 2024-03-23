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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@fenamnow/ui/components/ui/collapsible";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@fenamnow/ui/components/ui/form";
import { Input } from "@fenamnow/ui/components/ui/input";
import { Label } from "@fenamnow/ui/components/ui/label";
import { ScrollArea, ScrollBar } from "@fenamnow/ui/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@fenamnow/ui/components/ui/tooltip";
import { ChevronDownIcon, TrashIcon } from "@radix-ui/react-icons";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { propertyInsertFormSchema } from "@web/lib/schemas/property";
import { PublicImage } from "@web/modules/property/components/images";
import { Loader2, Plus } from "lucide-react";
import React, { useCallback } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export default function MediaForm({
  form,
  openForm,
  setOpenForm,
  savingProperty
}: {
  form: UseFormReturn<z.infer<typeof propertyInsertFormSchema>>;
  openForm: number;
  setOpenForm: React.Dispatch<React.SetStateAction<number>>;
  savingProperty: boolean;
}) {
  const supabase = useSupabaseBrowser();

  const onImagesDrop = useCallback(
    (acceptedFiles: File[]) => {
      const images = acceptedFiles.map(file =>
        Object.assign(file, {
          uri: URL.createObjectURL(file),
          alt: ""
        })
      );
      // console.log(images);
      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, ...images]);
      // console.log(...form.getValues("images"));
    },
    [form]
  );

  const onVideoDrop = useCallback(
    (acceptedFiles: File[]) => {
      const video = acceptedFiles.map(file =>
        Object.assign(file, {
          uri: URL.createObjectURL(file)
        })
      );

      form.setValue("video_tour", video[0]);
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

  const {
    getRootProps: getVideoRootProps,
    getInputProps: getVideoInputProps,
    open: openVideo,
    isDragActive: isVideoDragActive
  } = useDropzone({
    onDrop: onVideoDrop,
    accept: {
      "video/*": []
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
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024
  });

  return (
    <Card className="max-w-[640px]">
      <CardHeader>
        <CardTitle>Media</CardTitle>
        <CardDescription>
          Photos and videos that will be shown to viewers
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full">
        {/* Photos */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Photos</FormLabel>
              {(!field.value ||
                field.value.length == 0 ||
                field.value == undefined) && (
                <FormControl>
                  {/* If no images were loaded */}
                  <div
                    {...getRootProps()}
                    className="border-accent bg-background hover:bg-accent flex h-72 w-full flex-col items-center justify-center rounded-lg border-2 hover:border-dashed hover:border-neutral-600"
                  >
                    <input
                      {...getInputProps({
                        accept: "image/*"
                      })}
                    />
                    {!isDragActive && (
                      <>
                        <p className="text-md font-semibold opacity-40">
                          Click here to upload photos
                        </p>
                        <span className="text-base">or</span>
                        <p className="text-md font-semibold opacity-40">
                          Drag and drop here
                        </p>
                      </>
                    )}
                  </div>
                </FormControl>
              )}

              {/* if images were found or loaded */}
              {field.value !== undefined && field.value.length > 0 && (
                <FormControl>
                  <ScrollArea className="h-72 w-full whitespace-nowrap rounded-lg border">
                    <div className="flex w-max space-x-4 p-4">
                      {field.value?.map((image: any) => (
                        <figure key={image.uri} className="shrink-0">
                          <div className="flex max-w-48 items-start space-x-2">
                            <div className="w-full overflow-hidden rounded-md">
                              <PublicImage
                                priority
                                path={image.uri || image}
                                bucket="properties"
                                // alt={`Photo by ${image.artist}`}
                                alt=""
                                className="aspect-[3/4] size-fit object-cover"
                                width={300}
                                height={400}
                              />
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                field.onChange(
                                  field.value?.filter(
                                    (i: any) => i.uri !== image.uri
                                  )
                                );
                              }}
                            >
                              <TrashIcon />
                            </Button>
                          </div>
                          {/* Description */}
                          {image.uri && (
                            <div className="max-w-48">
                              <Label className="text-accent-foreground/80 text-sm">
                                Alt text
                              </Label>
                              <Input
                                className="w-[80%]"
                                value={image.alt}
                                onChange={e => {
                                  field.onChange(
                                    field.value?.map(
                                      (
                                        i: File & {
                                          uri: string;
                                          alt?: string;
                                        }
                                      ) => {
                                        if (i.uri === image.uri) {
                                          return Object.assign(i, {
                                            alt: e.target.value
                                          });
                                          // return {
                                          //   ...i,
                                          //   alt: e.target.value
                                          // };
                                        }
                                        return i;
                                      }
                                    )
                                  );
                                }}
                              />
                            </div>
                          )}
                        </figure>
                      ))}
                      <div className="w-12" />
                      <div className="flex w-24 items-center justify-center">
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={open}
                        >
                          <Plus /> Add more photos
                        </Button>
                      </div>
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </FormControl>
              )}
              <FormMessage />
              <FormDescription>
                Upload a minimum of 3 photos not more than 2MB each
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Videos */}
        <FormField
          control={form.control}
          name="video_tour"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Video</FormLabel>
              {/* if no video has been uploaded */}
              {!field.value && (
                <FormControl>
                  <div
                    {...getVideoRootProps({})}
                    className="border-accent bg-background hover:bg-accent flex h-72 w-full flex-col items-center justify-center rounded-lg border-2 hover:border-dashed hover:border-neutral-600"
                  >
                    <input
                      {...getVideoInputProps({
                        accept: "video/*"
                      })}
                    />
                    <p className="text-md font-semibold opacity-40">
                      Click here to upload video
                    </p>
                    <span className="text-base">or</span>
                    <p className="text-md font-semibold opacity-40">
                      Drag and drop here
                    </p>
                  </div>
                </FormControl>
              )}
              {field.value && (
                <FormControl>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <video
                          className="h-72 w-full rounded-lg border object-cover"
                          src={form.watch("video_tour")?.uri}
                          controls
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-transparent">
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => form.setValue("video_tour", undefined)}
                        >
                          <TrashIcon />
                        </Button>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
      <CardFooter>
        <Button type="submit" disabled={savingProperty}>
          {savingProperty && <Loader2 className="mr-2 animate-spin" />}Save
          property
        </Button>
      </CardFooter>
    </Card>
  );
}
