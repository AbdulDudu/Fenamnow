import { Button } from "@fenamnow/ui/components/ui/button";
import { Input } from "@fenamnow/ui/components/ui/input";
import React from "react";

export default function Newsletter() {
  return (
    <div className="bg-accent flex h-96 w-full flex-col items-center justify-center">
      <div className="container flex w-full flex-col items-center justify-center space-y-6">
        <h2>Are you a landlord?</h2>
        <p>
          Join our weekly newletter to get the latest news from and tips from
          our team
        </p>

        <div className="flex items-center space-x-2 sm:space-x-6 md:w-[450px]">
          <Input
            placeholder="Enter your email"
            className="border-accent-foreground border"
          />
          <Button>Subscribe</Button>
        </div>
      </div>
    </div>
  );
}
