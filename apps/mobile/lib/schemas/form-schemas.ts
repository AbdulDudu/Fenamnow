import * as z from "zod";

export const propertyInsertFormSchema = z.object({
  address: z.string().min(2).max(50),
  map_address: z.string({
    required_error: "Please enter a map address"
  }),
  city: z.string({ required_error: "Please select a city" }),
  community: z.string({ required_error: "Please select a community" }),
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  property_type: z.string({ required_error: "Please select a property type" }),
  listing_type: z.enum(["sale", "rental", "lease"]),
  lease_duration: z
    .string({
      required_error: "Please select a lease duration"
    })
    .nullish(),
  description: z
    .string({ required_error: "Please enter a description" })
    .min(2)
    .max(500),
  price: z.number().min(100).max(1000000),
  bedrooms: z.number().min(0).max(100, {
    message: "Bedrooms must be between 0 and 100."
  }),
  bathrooms: z
    .number()
    .min(0)
    .max(100, { message: "Bathrooms must be between 0 and 100." }),
  date_available: z.string(),
  amenities: z
    .array(z.any())
    .refine(value => value.some(item => item), {
      message: "You have to select at least one item."
    })
    .optional(),
  images: z.array(z.any()),
  property_size: z.number().nullish(),
  furnished: z.boolean().nullish(),
  video_tour: z.any().optional(),
  reference_code: z.string().min(2).max(50).nullish()
});
