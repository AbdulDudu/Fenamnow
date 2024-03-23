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
    .min(100, {
      message: "Description needs to be at least 100 characters long"
    })
    .max(5000, {
      message: "Description is too long"
    }),
  price: z
    .number()
    .min(1000, { message: "Price must be at least $1000" })
    .max(1000000, {
      message: "Price must be less than $1,000,000"
    }),
  bedrooms: z.number().min(0).max(100),
  bathrooms: z.number().min(0).max(100),
  date_available: z.date(),
  amenities: z
    .array(z.any())
    .refine(value => value.some(item => item), {
      message: "You have to select at least one item."
    })
    .optional(),
  images: z.array(z.any()),
  video_tour: z.any().optional()
});
