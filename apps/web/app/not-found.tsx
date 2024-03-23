import { Button } from "@fenamnow/ui/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not Found"
};
export default function NotFound() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center space-y-12">
      <h1>404</h1>
      <h3>Page Not found</h3>
      <p className="w-[40%] text-center">
        Seems you've tried to access a page that doesn't exist. Click the button
        below to go to the home page
      </p>

      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </main>
  );
}
