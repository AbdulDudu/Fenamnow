import PropertyCard, {
  PropertyCardProps
} from "@web/modules/property/components/card";

export default function ListingPreview({
  properties
}: {
  properties: PropertyCardProps[];
}) {
  return (
    <div className="mx-auto grid h-[95%] grid-cols-2 justify-between gap-10 overflow-y-auto md:grid-cols-3 lg:grid-cols-4">
      {properties?.map(property => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  );
}
