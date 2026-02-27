import Link from 'next/link';
import { Building2 } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-lg font-bold tracking-tight ${className}`}>
      <Building2 className="h-6 w-6 text-primary" />
      <span className="font-headline text-primary">Aether Luxury Properties</span>
    </Link>
  );
}
