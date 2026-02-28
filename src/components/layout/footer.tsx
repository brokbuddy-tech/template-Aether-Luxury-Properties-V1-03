
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Instagram, Facebook, Youtube, Linkedin, Twitter, ArrowUp, MapPin } from 'lucide-react';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useContactModal } from '@/hooks/use-contact-modal';

const footerLinkColumns = [
  {
    title: 'PROPERTY',
    links: [
      { label: 'Buy', href: '/buy' },
      { label: 'Rent', href: '/rent' },
      { label: 'Sell', href: '/sell' },
      { label: 'Off Plan', href: '/off-plan' },
      { label: 'Commercial', href: '/commercial' },
    ],
  },
  {
    title: 'RESOURCES',
    links: [
      { label: 'Community Guides', href: '#' },
      { label: 'News & Insights', href: '#' },
      { label: 'Market Reports', href: '#' },
      { label: 'Property Videos', href: '#' },
      { label: 'Podcasts', href: '#' },
    ],
  },
  {
    title: 'ABOUT US',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Meet The Team', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Apply Now', href: '#' },
      { label: 'Contact', href: '#', isContact: true },
    ],
  },
  {
    title: 'CONNECT',
    links: [
      { label: 'Instagram', href: '#', icon: Instagram },
      { label: 'Facebook', href: '#', icon: Facebook },
      { label: 'Youtube', href: '#', icon: Youtube },
      { label: 'Linkedin', href: '#', icon: Linkedin },
      { label: 'Tiktok', href: '#', icon: Twitter },
    ],
  },
];


export function Footer() {
  const { openModal } = useContactModal();
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);

  const toggleBackToTopVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsBackToTopVisible(true);
    } else {
      setIsBackToTopVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleBackToTopVisibility);
    return () => {
      window.removeEventListener('scroll', toggleBackToTopVisibility);
    };
  }, []);

  return (
    <footer className="bg-muted text-foreground pt-16">
        <div className="container">
            <div className="flex flex-col lg:flex-row justify-between gap-12">
                {/* Column 1: Brand & Contact */}
                <div className="flex-shrink-0 lg:w-auto">
                    <Logo />
                    <div className="mt-6 space-y-4 max-w-xs">
                        <p className="font-bold text-lg text-primary">+971 4 876 2333</p>
                        <p className="text-sm text-muted-foreground">Aether Luxury Properties LLC, 7th, 8th & 20th Floor, Control Tower, Motor City, Dubai, UAE.</p>
                        <a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                            <MapPin className="h-4 w-4" />
                            GET DIRECTIONS
                        </a>
                    </div>
                </div>

                {/* Columns 2-5: Links */}
                <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-8">
                    {footerLinkColumns.map((column) => (
                        <div key={column.title}>
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4">{column.title}</h3>
                            <ul className="space-y-3">
                                {column.links.map((link) => {
                                    const Icon = link.icon;
                                    const content = (
                                        <>
                                            {Icon && <Icon className="h-5 w-5" />}
                                            <span>{link.label}</span>
                                        </>
                                    );
                                    if (link.isContact) {
                                        return (
                                            <li key={link.label}>
                                                <button onClick={openModal} className="flex items-center gap-3 text-base text-muted-foreground hover:text-primary transition-colors text-left w-full">
                                                    {content}
                                                </button>
                                            </li>
                                        );
                                    }
                                    return (
                                        <li key={link.label}>
                                            <Link href={link.href} target={link.icon ? '_blank' : '_self'} rel={link.icon ? 'noopener noreferrer' : ''} className="flex items-center gap-3 text-base text-muted-foreground hover:text-primary transition-colors">
                                               {content}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Column 6: Awards */}
                <div className="flex-shrink-0">
                     <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4 lg:text-right">Awards</h3>
                     <div className="flex gap-4 items-start justify-start lg:justify-end">
                        <div className="bg-gray-800 text-white p-4 h-[150px] w-24 flex flex-col justify-center items-center text-center rounded">
                            <p className="font-bold text-xs">Dubai Property Awards</p>
                            <p className="text-xs mt-1">2025-2026</p>
                            <p className="text-xs mt-2 leading-tight">Best Real Estate Agency Single Office</p>
                        </div>
                         <div className="bg-gray-800 text-white p-4 h-[150px] w-24 flex flex-col justify-center items-center text-center rounded">
                            <p className="font-bold text-xs">Dubai Property Awards</p>
                            <p className="text-xs mt-1">2025-2026</p>
                            <p className="text-xs mt-2 leading-tight">Best Real Estate Agency Marketing</p>
                        </div>
                        <div className="bg-red-600 text-white p-4 h-[150px] w-24 flex flex-col justify-center items-center text-center rounded">
                            <p className="font-bold text-sm">Great Place To Work</p>
                            <p className="text-xs mt-1">Certified</p>
                        </div>
                     </div>
                </div>
            </div>

            <div className="mt-16 border-t border-border pt-8 pb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                     <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <Link href="#" className="hover:text-primary">Terms & Conditions</Link>
                        <Link href="#" className="hover:text-primary">Privacy Policy</Link>
                        <Link href="#" className="hover:text-primary">Cookie Policy</Link>
                        <Link href="#" className="hover:text-primary">Complaints</Link>
                    </div>
                    <p className="text-sm text-muted-foreground text-center md:text-right">&copy; Aether Luxury Properties 2026</p>
                </div>
            </div>
        </div>
        {isBackToTopVisible && (
            <Button
                onClick={scrollToTop}
                className="fixed bottom-5 right-5 h-12 w-12 rounded-full border border-border/30 bg-background/30 text-primary backdrop-blur-lg shadow-lg hover:bg-background/50 transition-opacity duration-300"
                size="icon"
                aria-label="Back to top"
            >
                <ArrowUp className="h-6 w-6" />
            </Button>
        )}
    </footer>
  );
}
