import { getPropertyById } from "@/lib/data/property";
import { useSession } from "@/lib/providers/session";
import { propertyInsertFormSchema } from "@/lib/schemas/form-schemas";
import { Screen } from "@/modules/common/ui/screen";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { OverlayProvider } from "@gluestack-ui/overlay";
import {
  Center,
  HStack,
  ScrollView,
  Spinner,
  Text
} from "@gluestack-ui/themed";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { Platform, ScrollViewProps } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as z from "zod";
import AddressForm from "../components/address-form";
import ListingDetailsForm from "../components/listing-details-form";

export default function PropertyEditScreen() {
  const { id } = useLocalSearchParams();
  const { session } = useSession();
  const { data: propertyData, isPending } = useQuery({
    queryKey: ["property edit", id],
    queryFn: () => getPropertyById({ id: parseInt(id as string) })
  });

  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    watch,
    formState: { errors }
  } = useForm<z.infer<typeof propertyInsertFormSchema>>({
    resolver: zodResolver(propertyInsertFormSchema),
    defaultValues: {
      images: []
    },
    // @ts-ignore
    values:
      id && propertyData?.data
        ? {
            ...propertyData.data,
            bathrooms: propertyData.data.bathrooms,
            bedrooms: propertyData.data.bedrooms,
            price: propertyData.data.price,
            property_size: propertyData?.data?.property_size,
            deposit: propertyData?.data?.deposit,
            available_date: dayjs(propertyData.data.date_available),
            user_id: session?.user.id,
            video_tour: propertyData?.data?.video_tour
          }
        : null
  });

  return (
    <>
      <Screen
        width="$full"
        edges={["bottom"]}
        paddingHorizontal="$6"
        position="relative"
      >
        <OverlayProvider>
          <KeyboardAwareScrollView
            extraHeight={Platform.OS == "android" ? 100 : 150}
            enableOnAndroid={Platform.OS == "android"}
          >
            {isPending && id ? (
              <Center
                position="absolute"
                borderWidth="$1"
                height="$full"
                opacity="$25"
                width="$full"
              >
                <Text semibold>Loading Property details</Text>
                <Spinner size="large" />
              </Center>
            ) : null}

            <ScrollView flex={1} keyboardShouldPersistTaps={"handled"}>
              {/* Subheading */}
              {!id ? (
                <HStack width="$full" my="$4" justifyContent="center">
                  <Text width="70%" fontWeight="$medium" textAlign="center">
                    Fill in the fields below to add a new property
                  </Text>
                </HStack>
              ) : null}
              <AddressForm
                control={control}
                watch={watch}
                setValue={setValue}
                errors={errors}
              />
              <ListingDetailsForm
                control={control}
                watch={watch}
                setValue={setValue}
                errors={errors}
                handleSubmit={handleSubmit}
              />
            </ScrollView>
          </KeyboardAwareScrollView>
        </OverlayProvider>
      </Screen>
      <Toasts providerKey="property-edit-modal" />
    </>
  );
}
