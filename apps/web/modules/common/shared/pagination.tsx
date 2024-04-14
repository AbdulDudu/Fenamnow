import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@fenamnow/ui/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

export default function SearchPagination({ count }: { count: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      if (value == "all") {
        params.delete(name);
      }
      if (name === "city") {
        params.delete("community");
      }
      return params.toString();
    },
    [searchParams]
  );

  const page = parseInt(searchParams.get("page") || "0") || undefined;
  return (
    <Pagination className="">
      <PaginationContent className="">
        {count > 6 && (
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
        )}
        {Array.from({ length: Math.ceil(count / 9) }).map((_, index) => (
          <PaginationItem key={`page-${index}`}>
            <PaginationLink
              href={
                pathname +
                "?" +
                createQueryString("page", (index + 1).toString())
              }
              isActive={page === index + 1}
              className="cursor-pointer"
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        {count / 6 > 5 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {count / 6 >= 5 && (
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
