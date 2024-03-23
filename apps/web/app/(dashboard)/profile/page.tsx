import ProfileScreen from "@web/modules/dashboard/screens/profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Fenamnow"
};

export default function ProfilePage() {
  return <ProfileScreen />;
}
