import { HydrationBoundary } from "@tanstack/react-query";
import PropertyEditScreen from "@web/modules/dashboard/properties/screens/edit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Property | Fenamnow"
};
export default async function PropertiesEditPage() {
  return (
    <HydrationBoundary>
      <PropertyEditScreen />
    </HydrationBoundary>
  );
}
