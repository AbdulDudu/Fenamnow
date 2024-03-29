"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@fenamnow/ui/components/ui/pagination";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { getProperties } from "@web/lib/queries/properties";
import { useSession } from "@web/modules/common/shared/providers/session";
import PropertyCard from "@web/modules/property/components/card";
import { Loader2Icon } from "lucide-react";

export default function PropertiesListScreen({ page }: { page: number }) {
  const { session } = useSession();
  const supabase = useSupabaseBrowser();

  const {
    data: properties,
    error: propertiesError,
    isPending: propertiesPending,
    count: propertiesCount
  } = useQuery(
    getProperties({
      session,
      isAdmin: true,
      client: supabase,
      start: (page - 1) * 7,
      end: page * 7
    })
  );

  return (
    <div className="flex size-full flex-col justify-between pt-2">
      {propertiesError ? (
        <div className="flex max-h-[80vh] flex-1 flex-col items-center justify-center">
          <p>Error loading properties</p>
        </div>
      ) : propertiesPending ? (
        <div className="flex max-h-[80vh] flex-1 flex-col items-center justify-center space-y-2">
          <p>Loading properties</p>
          <Loader2Icon size={32} className="animate-spin" />
        </div>
      ) : (
        <div className="no-scrollbar container mx-auto grid h-[85vh] max-w-[1440px] grid-cols-2 justify-between gap-x-6 gap-y-4 overflow-y-auto sm:grid-cols-2 md:grid-cols-3 md:gap-x-16 lg:grid-cols-4">
          {properties?.map(property => (
            <PropertyCard key={property.id} isDashboard {...property} />
          ))}
        </div>
      )}

      {propertiesCount && (
        <Pagination className="h-10">
          <PaginationContent>
            {propertiesCount > 8 && (
              <PaginationItem>
                <PaginationPrevious
                  href={page === 1 ? `?page=${page}` : `?page=${page - 1}`}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
            {[...Array(Math.floor(propertiesCount / 8))].map((_, index) => (
              <PaginationItem key={`page-${index}`}>
                <PaginationLink
                  href={`?page=${index + 1}`}
                  isActive={page === index + 1}
                  className="cursor-pointer"
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {Math.floor(propertiesCount / 8) > 4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href={
                  page === Math.floor(propertiesCount / 8)
                    ? `?page=${page}`
                    : `?page=${page + 1}`
                }
                className="cursor-pointer"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
