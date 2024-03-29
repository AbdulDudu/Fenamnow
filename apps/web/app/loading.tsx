import { Loader2 } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center space-y-12">
      <Loader2 className="h-12 w-12 animate-spin" />
    </main>
  );
}
