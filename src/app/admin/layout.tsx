import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/40 min-h-screen">
      <header className="bg-background border-b">
        <div className="container max-w-7xl h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold font-headline text-primary">Admin Panel</h1>
          <Button variant="outline" asChild>
            <Link href="/"><Home className="mr-2 h-4 w-4"/> Back to Site</Link>
          </Button>
        </div>
      </header>
      <main className="py-8">
        {children}
      </main>
    </div>
  );
}
