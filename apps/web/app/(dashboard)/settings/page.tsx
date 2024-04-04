import SettingsScreen from "@web/modules/dashboard/settings/screens";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Fenamnow"
};

export default function SettingsPage() {
  return <SettingsScreen />;
}
