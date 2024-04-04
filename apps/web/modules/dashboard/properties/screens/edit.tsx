"use client";

import { Button } from "@fenamnow/ui/components/ui/button";
import { Form } from "@fenamnow/ui/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { useClientPublicUrls } from "@web/lib/hooks/use-client-public-url";
import {
  getAmenities,
  getLeaseDurations,
  getPropertyById,
  getPropertyTypes
} from "@web/lib/queries/properties";
import { propertyInsertFormSchema } from "@web/lib/schemas/property";
import { useSession } from "@web/modules/common/shared/providers/session";
import { customAlphabet } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import AddressForm from "../components/address-form";
import ListingDetailsForm from "../components/listing-details-form";
import MediaForm from "../components/media-form";

export default function PropertyEditScreen({ id }: { id?: number }) {
  const supabase = useSupabaseBrowser();
  const { session } = useSession();
  const router = useRouter();

  const [openForm, setOpenForm] = useState(1);
  const [savingProperty, setSavingProperty] = useState(false);

  const { data: property } = useQuery(
    getPropertyById({ client: supabase, id: id! }),
    {
      enabled: !!id
    }
  );

  // @ts-ignore
  const videoURL = useClientPublicUrls(property?.video_tour?.uri, "properties");
  const form = useForm<z.infer<typeof propertyInsertFormSchema>>({
    resolver: zodResolver(propertyInsertFormSchema),
    defaultValues: {
      images: [],
      amenities: []
    },
    values: id
      ? {
          ...property!,
          amenities: (property?.amenities as string[]) || [],
          date_available: new Date(property?.date_available as string),
          video_tour: {
            uri: videoURL
          }
        }
      : undefined
  });

  async function onSubmit(values: z.infer<typeof propertyInsertFormSchema>) {
    try {
      setSavingProperty(true);
      const referenceCode = customAlphabet(
        "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        8
      )();
      const uploadedImage = values.images.map(
        async (
          image:
            | (File & { uri: string; alt?: string })
            | { uri: string; alt?: string }
        ) => {
          if (image instanceof File) {
            const file = image;
            const fileExt = file.name.split(".").pop();
            const filePath = `${id ? property?.reference_code : referenceCode}/images/${Math.random()}.${fileExt}`;
            const { data: imageData, error: uploadError } =
              await supabase.storage.from("properties").upload(filePath, file);
            if (uploadError) {
              throw uploadError;
            }
            return {
              uri: imageData.path,
              alt: image.alt || ""
            };
          }
          return {
            uri: image.uri,
            alt: image.alt || ""
          };
        }
      );

      const imagesPromise = Promise.all(uploadedImage);
      toast.promise(imagesPromise, {
        loading: "uploading images",
        success: () => {
          return "images uploaded successfully";
        },
        error: "Error"
      });

      const images = (await imagesPromise).map(image => image);
      const video = async () => {
        if (values.video_tour && values.video_tour instanceof File) {
          const file = values.video_tour;
          const fileExt = file.name.split(".").pop();
          const filePath = `${referenceCode}/videos/${Math.random()}.${fileExt}`;
          const { data: videoData, error: uploadError } = await supabase.storage
            .from("properties")
            .upload(filePath, file);
          if (uploadError) {
            throw uploadError;
          }
          const { data: uploadedVideo, error: uploadedVideoError } =
            await supabase
              .from("videos")
              .insert({
                uri: videoData.path
              })
              .select()
              .single();
          if (uploadedVideoError) {
            throw uploadedVideoError;
          }
          return uploadedVideo.id;
        }
        return (property?.video_tour as { id?: string })?.id;
      };

      toast.promise(video, {
        loading: "uploading video tour",
        success: () => {
          return "video uploaded successfully";
        },
        error: "Error"
      });

      const video_tour = await video();

      const propertyPromise = new Promise(async (resolve, reject) => {
        if (!id) {
          resolve(undefined);
        }
        const { data, error } = await supabase
          .from("properties")
          .upsert({
            id: id ? parseInt(id as unknown as string) : undefined,
            user_id: session.user.id,
            address: values.address as string,
            city: values.city,
            community: values.community,
            latitude: values.latitude,
            longitude: values.longitude,
            map_address: values.map_address,
            date_available: values.date_available.toISOString(),
            description: values.description,
            listing_type: values.listing_type,
            lease_duration: values.lease_duration,
            price: values.price,
            property_type: values.property_type,
            images,
            video_tour: video_tour,
            amenities: values.amenities,
            reference_code: referenceCode,
            status: "available"
          })
          .select()
          .single();
        if (error) {
          reject(error);
        }
        resolve(data);
      });

      toast.promise(propertyPromise, {
        loading: id ? "Updating property" : "Adding new property",
        success: () => {
          return id
            ? "Property updated successfully"
            : "Property added successfully";
        },
        description: "You will be redirected to properties page"
      });

      router.replace("/properties");
    } catch (error: any) {
      toast.error(`Something went wrong! ${error.message}`);
    } finally {
      setSavingProperty(false);
    }
  }
  const { data: propertyTypes } = useQuery(
    getPropertyTypes({ client: supabase })
  );

  const { data: leaseDurations } = useQuery(
    getLeaseDurations({ client: supabase })
  );

  const { data: amenities } = useQuery(getAmenities({ client: supabase }));
  return (
    <div className="flex h-[94vh] flex-col overflow-y-hidden">
      <Form {...form}>
        <div className="no-scrollbar container flex size-full flex-col justify-start space-y-4 overflow-y-auto pt-8">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Button asChild variant="link" className="size-max p-0">
              <Link href={id ? "../" : "/properties"}>
                <ChevronLeftIcon />
                Back to properties
              </Link>
            </Button>
            <div>
              <h3>{id ? "Edit Property" : "Add New Property"}</h3>
              <p>
                {id
                  ? "Changes made here will be updated after saving"
                  : "Fill in all required fields to add new property"}
              </p>
            </div>
            <AddressForm
              form={form}
              openForm={openForm}
              setOpenForm={setOpenForm}
            />
            <ListingDetailsForm
              form={form}
              openForm={openForm}
              setOpenForm={setOpenForm}
              propertyTypes={propertyTypes || []}
              leaseDurations={leaseDurations || []}
              amenities={amenities || []}
            />
            <MediaForm
              form={form}
              openForm={openForm}
              setOpenForm={setOpenForm}
              savingProperty={savingProperty}
            />
          </form>
        </div>
      </Form>
    </div>
  );
}
