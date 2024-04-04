import { ScrollArea } from "@fenamnow/ui/components/ui/scroll-area";
import SearchPropertyCard from "./property-card";

export default function SearchResultsList({
  count = 0,
  listing_type,
  properties
}: {
  count?: number | null;
  listing_type: string;
  properties: any;
}) {
  if (properties?.length == 0) {
    return <div className="w-full flex-1" />;
  }

  return (
    <div className="w-full flex-1">
      <ScrollArea className="size-full">
        <div className="grid size-full grid-cols-2 justify-between gap-6 lg:grid-cols-3">
          {properties?.map((property: any) => (
            <SearchPropertyCard key={property.id} {...property} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
