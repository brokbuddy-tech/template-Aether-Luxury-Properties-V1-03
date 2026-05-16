import Image from 'next/image';
import { Building2 } from 'lucide-react';

type LogoProps = {
  className?: string;
  logoUrl?: string | null;
  name?: string | null;
};

export function Logo({ className, logoUrl, name }: LogoProps) {
  const displayName = name || 'Aether Luxury Properties';

  return (
    <div className={`flex items-center gap-3 text-lg font-bold tracking-tight ${className || ''}`}>
      {logoUrl ? (
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-primary/20 bg-white">
          <Image src={logoUrl} alt={displayName} fill className="object-contain p-1" />
        </div>
      ) : (
        <Building2 className="h-6 w-6 text-primary" />
      )}
      <span className="font-headline text-primary">{displayName}</span>
    </div>
  );
}
