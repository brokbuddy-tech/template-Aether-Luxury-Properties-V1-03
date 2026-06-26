
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Instagram, Facebook, Linkedin, X as XIcon, ArrowUp, type LucideIcon } from 'lucide-react';
import { getSiteConfig, toSocialUrl } from '@/lib/api';
import { getAgencyDisplayName } from '@/lib/live-mappers';

import type { SiteConfig } from '@/lib/live-types';

type FooterLink = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

type FooterLinkColumn = {
  title: string;
  links: FooterLink[];
};

const footerLinkColumns: FooterLinkColumn[] = [
  {
    title: 'Site Map',
    links: [
      { label: 'Homepage', href: '/' },
      { label: 'Buy', href: '/buy' },
      { label: 'Rent', href: '/rent' },
      { label: 'Sell', href: '/sell' },
      { label: 'Off Plan', href: '/off-plan' },
      { label: 'Commercial', href: '/commercial' },
      { label: 'Agents', href: '/agents' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Services', href: '#' },
      { label: "Lawyer's Corners", href: '#' },
    ],
  },
];

const socialIconLinks: FooterLink[] = [
  { label: 'X', href: '#', icon: XIcon },
  { label: 'Linkedin', href: '#', icon: Linkedin },
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'Facebook', href: '#', icon: Facebook },
];

export function Footer() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

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

  const mappedDisplayName = getAgencyDisplayName(siteConfig);
  const displayName = mappedDisplayName === 'Agency Website' ? 'Aether Luxury' : mappedDisplayName;
  const logoUrl = siteConfig?.profile?.logo || null;
  const footerDescription =
    siteConfig?.branding?.tagline
    || siteConfig?.branding?.bio
    || siteConfig?.profile?.aboutCompany
    || 'Luxury real estate advisors helping clients discover, market, and secure exceptional Dubai properties.';
  const socialLinks = [
    { label: 'X', href: toSocialUrl('twitter', siteConfig?.branding?.twitter || siteConfig?.profile?.social?.twitterUrl) || '#' },
    { label: 'Linkedin', href: toSocialUrl('linkedin', siteConfig?.branding?.linkedin) || '#' },
    { label: 'Instagram', href: toSocialUrl('instagram', siteConfig?.branding?.instagram || siteConfig?.profile?.social?.instagramUrl) || '#' },
    { label: 'Facebook', href: siteConfig?.profile?.social?.facebookUrl || '#' },
  ];
  const socialColumns = socialIconLinks.map((link) => ({
    ...link,
    href: socialLinks.find((social) => social.label === link.label)?.href || '#',
  }));
  const copyrightText =
    siteConfig?.profile?.footer?.copyrightSuffix
    || `Copyright \u00A9 ${new Date().getFullYear()}, ${displayName}, All Rights Reserved.`;

  const renderLink = (link: FooterLink, className: string) => (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );

  return (
    <footer className="bg-[#004d46] text-[#d9ebe7]">
      <div className="w-full overflow-hidden bg-[#004d46]">
        <div className="relative min-h-[420px] px-5 py-10 sm:px-8 sm:py-12 md:px-20 md:py-14 lg:px-28">
          <svg
            className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[62%] text-[#2c7069] opacity-55 md:block"
            viewBox="0 0 720 430"
            fill="none"
            aria-hidden="true"
          >
            <path d="M160 430L470 0" stroke="currentColor" strokeWidth="1" />
            <path d="M250 430L565 128L720 332" stroke="currentColor" strokeWidth="1" />
            <path d="M360 430L500 285L720 410" stroke="currentColor" strokeWidth="1" />
            <path d="M720 300L570 0" stroke="currentColor" strokeWidth="1" />
          </svg>

          <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(260px,1fr)_minmax(320px,0.95fr)] lg:gap-24">
            <div className="flex max-w-none flex-col items-start sm:max-w-[420px]">
              <Link href="/" aria-label={displayName} className="inline-flex max-w-full items-center gap-3">
                {logoUrl ? (
                  <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#e3aa1d]/50 bg-white">
                    <Image src={logoUrl} alt={displayName} fill className="object-contain p-1" />
                  </span>
                ) : (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#e3aa1d]">
                    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
                      <path d="M16 4L27 26H5L16 4Z" stroke="currentColor" strokeWidth="2.2" />
                      <path d="M16 10L22 23H10L16 10Z" stroke="currentColor" strokeWidth="2.2" />
                      <path d="M16 16L19 23H13L16 16Z" stroke="currentColor" strokeWidth="2.2" />
                    </svg>
                  </span>
                )}
                <span className="min-w-0 break-words font-headline text-lg font-bold uppercase leading-tight tracking-[0.08em] text-[#f2f5f2] sm:text-2xl">
                  {displayName}
                </span>
              </Link>

              <p className="mt-6 max-w-none text-sm font-medium leading-6 text-[#e1efeb] sm:mt-8 sm:max-w-[34rem] sm:text-[16px] sm:font-bold sm:leading-7">
                {footerDescription}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-5 sm:mt-9 sm:gap-7">
                {socialColumns.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href === '#' ? undefined : '_blank'}
                      rel={link.href === '#' ? undefined : 'noopener noreferrer'}
                      aria-label={link.label}
                      className="text-[#d9ebe7] transition-colors hover:text-[#e3aa1d]"
                    >
                      {Icon && <Icon className="h-[22px] w-[22px]" strokeWidth={2.4} />}
                    </a>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={scrollToTop}
                className="mt-8 inline-flex h-11 w-full items-center justify-center gap-3 border border-[#d9ebe7]/80 px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#d9ebe7] transition-colors hover:border-[#e3aa1d] hover:text-[#e3aa1d] sm:mt-12 sm:w-auto sm:justify-start sm:gap-4"
              >
                <span className="flex h-5 w-5 items-center justify-center">
                  <ArrowUp className="h-5 w-5" />
                </span>
                Back To Top
              </button>
            </div>

            <div className="grid w-full max-w-none grid-cols-2 gap-8 sm:max-w-[520px] sm:gap-10 lg:ml-auto lg:mr-16 xl:mr-24">
              {footerLinkColumns.map((column) => (
                <div key={column.title}>
                  <h3 className="mb-5 font-body text-[15px] font-bold tracking-normal text-[#f2f5f2] sm:mb-8">
                    {column.title}
                  </h3>
                  <ul className="space-y-3 sm:space-y-4">
                    {column.links.map((link, index) => (
                      <li key={link.label}>
                        {renderLink(
                          link,
                          [
                            'text-[15px] leading-none text-[#b9d2cd] transition-colors hover:text-[#f2f5f2]',
                            index === 0 && column.title === 'Site Map' ? 'underline underline-offset-4 text-[#e5f3ef]' : '',
                          ].join(' ')
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#e3aa1d] px-4 py-2 text-center text-[10px] leading-snug text-[#164942] sm:px-6">
          {copyrightText}
        </div>
      </div>
    </footer>
  );
}
