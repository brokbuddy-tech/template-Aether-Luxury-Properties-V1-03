"use client";

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useContactModal } from '@/hooks/use-contact-modal';

export function Footer() {
  const { openModal } = useContactModal();

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:h-24 md:flex-row md:py-0 max-w-7xl">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Logo />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Aether Luxury Properties. All rights reserved.
          </p>
        </div>
        <Button onClick={openModal} variant="outline">
          List Your Property
        </Button>
      </div>
    </footer>
  );
}
