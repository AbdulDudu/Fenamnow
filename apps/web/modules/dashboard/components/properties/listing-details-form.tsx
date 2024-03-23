import { Database } from "@fenamnow/types/database";
import { Button } from "@fenamnow/ui/components/ui/button";
import { Calendar } from "@fenamnow/ui/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@fenamnow/ui/components/ui/card";
import { Checkbox } from "@fenamnow/ui/components/ui/checkbox";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@fenamnow/ui/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@fenamnow/ui/components/ui/select";
import { Textarea } from "@fenamnow/ui/components/ui/textarea";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@ui/lib/utils";
import { propertyInsertFormSchema } from "@web/lib/schemas/property";
import { format } from "date-fns";
import { DollarSignIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

export default function ListingDetailsForm({
  form,
  openForm,
  setOpenForm,
  propertyTypes = [],
  leaseDurations = [],
  amenities = []
}: {
  form: UseFormReturn<z.infer<typeof propertyInsertFormSchema>>;
  openForm: number;
  setOpenForm: React.Dispatch<React.SetStateAction<number>>;
  propertyTypes?: Database["public"]["Tables"]["property_types"]["Row"][];
  leaseDurations?: Database["public"]["Tables"]["lease_durations"]["Row"][];
  amenities?: Database["public"]["Tables"]["amenities"]["Row"][];
}) {
  return (
    <Card className="max-w-[640px]">
      <CardHeader>
        <CardTitle>Listing Details</CardTitle>
        <CardDescription>Full description of the property</CardDescription>
      </CardHeader>
      <CardContent className="w-full space-y-4">
        {/* Property type, listing type and lease duration */}
        <div className="flex items-center justify-between space-x-6">
          <FormField
            control={form.control}
            name="property_type"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Property type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl className="capitalize">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {propertyTypes.map(type => (
                      <SelectItem
                        key={type.id}
                        value={type.name}
                        className="capitalize"
                      >
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="listing_type"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Listing type</FormLabel>
                <Select
                  onValueChange={value => {
                    form.setValue("lease_duration", undefined);
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl className="capitalize">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Listing" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sale" className="capitalize">
                      Sale
                    </SelectItem>
                    <SelectItem value="rental" className="capitalize">
                      Rental
                    </SelectItem>
                    <SelectItem value="Lease" className="capitalize">
                      Lease
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lease_duration"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Lease duration</FormLabel>
                <Select
                  disabled={form.watch("listing_type") === "sale"}
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                  value={field?.value || undefined}
                >
                  <FormControl className="capitalize">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {leaseDurations.map(duration => (
                      <SelectItem
                        key={duration.id}
                        value={duration.name}
                        className="capitalize"
                      >
                        {duration.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Price, bedrooms and bathrooms */}
        <div className="flex items-center justify-between space-x-6">
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Price</FormLabel>
                <div className="relative">
                  <FormControl className="pl-8">
                    <Input
                      type="number"
                      min={100}
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <DollarSignIcon className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Bedrooms */}
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    max={100}
                    min={0}
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Bathrooms */}
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    max={100}
                    min={0}
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Property Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Description</FormLabel>
              <FormControl className="min-h-24 resize-y">
                <Textarea
                  placeholder="Tell us more about the property"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amenities */}
        <FormField
          control={form.control}
          name="amenities"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Amenities</FormLabel>
                <FormDescription>
                  Select the amenities the property has
                </FormDescription>
              </div>
              <div className="flex w-full flex-wrap gap-6">
                {amenities.map(amenity => (
                  <FormField
                    key={amenity.id}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={amenity.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(amenity.name)}
                              onCheckedChange={checked => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value as string[]),
                                      amenity.name
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        value => value !== amenity.name
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal capitalize">
                            {amenity.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date_available"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date available</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto size-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The date from which the property can be booked
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
      <CardFooter>
        {/* <Button
              type="button"
              onClick={() => {
                setOpenForm(3);
              }}
            >
              Next
            </Button> */}
      </CardFooter>
    </Card>
  );
}
