import Image from 'next/image';
import { Building2 } from 'lucide-react';

type LogoProps = {
  className?: string;
  logoUrl?: string | null;
  name?: string | null;
};

export function Logo({ className, logoUrl, name }: LogoProps) {
  const displayName = name || 'Agency Website';

  return (
    <div className={`flex min-w-0 items-center gap-2 text-lg font-bold tracking-tight sm:gap-3 ${className || ''}`}>
      {logoUrl ? (
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-primary/20 bg-white">
          <Image src={logoUrl} alt={displayName} fill className="object-contain p-1" />
        </div>
      ) : (
        <Building2 className="h-6 w-6 shrink-0 text-primary" />
      )}
      <span className="min-w-0 truncate font-headline text-base text-primary sm:text-lg">{displayName}</span>
    </div>
  );
}
