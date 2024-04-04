import DashboardScreen from "@web/modules/dashboard/settings/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Fenamnow"
};
export default function DashboardPage() {
  return <DashboardScreen />;
}
