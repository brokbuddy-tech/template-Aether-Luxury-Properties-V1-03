
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster"
import { AiSearchModalProvider } from '@/hooks/use-ai-search-modal';
import { AiSearchModal } from '@/components/ai-search-modal';
import { getSiteConfig } from '@/lib/api';
import { getAgencyDisplayName } from '@/lib/live-mappers';


export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  const agencyName = getAgencyDisplayName(siteConfig);
  const logoIconUrl = siteConfig?.profile?.logo?.trim() || undefined;

  return {
    title: agencyName,
    description:
      siteConfig?.branding?.tagline
      || siteConfig?.branding?.bio
      || 'Dubai real estate made clear, seamless, and well handled.',
    icons: logoIconUrl
      ? {
          icon: [{ url: logoIconUrl }],
          shortcut: [{ url: logoIconUrl }],
          apple: [{ url: logoIconUrl }],
        }
      : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-muted">
        <AiSearchModalProvider>
          <div className="max-w-screen-2xl mx-auto bg-background shadow-lg">
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </div>
          <AiSearchModal />
          <Toaster />
        </AiSearchModalProvider>
      </body>
    </html>
  );
}
