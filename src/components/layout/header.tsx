
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { getSiteConfig } from '@/lib/api';
import { getAgencyDisplayName } from '@/lib/live-mappers';
import type { SiteConfig } from '@/lib/live-types';

const navLinks = [
  { href: '/buy', label: 'BUY' },
  { href: '/rent', label: 'RENT' },
  { href: '/sell', label: 'SELL' },
  { href: '/off-plan', label: 'OFF-PLAN' },
  { href: '/agents', label: 'AGENTS' },
  { href: '/about', label: 'ABOUT US' },
  { href: '/commercial', label: 'COMMERCIAL' },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const desktopNavRef = useRef<HTMLElement | null>(null);
  const desktopLinkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const activeNavHref = navLinks.find((link) => pathname === link.href || pathname.startsWith(`${link.href}/`))?.href;
  const [activeUnderline, setActiveUnderline] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSiteConfig() {
      try {
        const nextSiteConfig = await getSiteConfig();
        if (active) {
          setSiteConfig(nextSiteConfig);
        }
      } catch {
        if (active) {
          setSiteConfig(null);
        }
      }
    }

    void loadSiteConfig();

    return () => {
      active = false;
    };
  }, []);

  const displayName = getAgencyDisplayName(siteConfig);
  const logoUrl = siteConfig?.profile?.logo || null;

  useEffect(() => {
    const updateUnderline = () => {
      if (!activeNavHref || !desktopNavRef.current) {
        setActiveUnderline(null);
        return;
      }

      const activeLink = desktopLinkRefs.current[activeNavHref];
      if (!activeLink) {
        setActiveUnderline(null);
        return;
      }

      const navRect = desktopNavRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setActiveUnderline({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
      });
    };

    updateUnderline();
    window.addEventListener('resize', updateUnderline);
    return () => window.removeEventListener('resize', updateUnderline);
  }, [activeNavHref]);

  const NavLink = ({ href, label, isDesktop = false }: { href: string; label: string; isDesktop?: boolean }) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
    <Link
      href={href}
      ref={isDesktop ? (node) => {
        desktopLinkRefs.current[href] = node;
      } : undefined}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'relative py-2 text-sm lg:text-base font-bold transition-colors hover:text-primary uppercase tracking-wider',
        isActive ? 'text-primary' : 'text-foreground/60'
      )}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {label}
    </Link>
    );
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 md:bg-background/50 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70 md:supports-[backdrop-filter]:bg-background/30">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" aria-label={displayName} className="min-w-0">
          <Logo logoUrl={logoUrl} name={displayName} />
        </Link>
        
        <nav ref={desktopNavRef} className="relative hidden md:flex items-center gap-3 lg:gap-6 xl:gap-8 pb-1">
          {activeUnderline && (
            <span
              className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-primary transition-all duration-300 ease-out"
              style={{
                left: activeUnderline.left,
                width: activeUnderline.width,
              }}
            />
          )}
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} isDesktop />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:flex bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/contact">CONTACT US</Link>
          </Button>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] bg-background">
              <div className="p-4">
                <div className="flex justify-between items-center mb-8">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} aria-label={displayName}>
                    <Logo logoUrl={logoUrl} name={displayName} />
                  </Link>
                  <SheetTrigger asChild>
                     <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close menu</span>
                     </Button>
                  </SheetTrigger>
                </div>
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} {...link} />
                  ))}
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/contact">CONTACT US</Link>
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
