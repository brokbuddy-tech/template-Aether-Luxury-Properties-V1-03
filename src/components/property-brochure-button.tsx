'use client';

import {
  cloneElement,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Building2, Loader2, Mail, MapPin, Phone } from 'lucide-react';
import { createPortal } from 'react-dom';

type BrochureStat = {
  label: string;
  value: string;
};

type BrochureButtonProps = {
  brochure: {
    title: string;
    subtitle?: string;
    priceLabel?: string;
    description: string;
    heroImage?: string | null;
    gallery?: string[];
    stats?: BrochureStat[];
    agentName?: string;
    agentTitle?: string;
    agentImage?: string | null;
    contactPhone?: string | null;
    contactEmail?: string | null;
    organizationName?: string;
  };
  children: ReactElement<{
    disabled?: boolean;
    children?: ReactNode;
  }>;
};

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function waitForImageAsset(image: HTMLImageElement) {
  if (image.complete && image.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      image.removeEventListener('load', finish);
      image.removeEventListener('error', finish);
      resolve();
    };

    image.addEventListener('load', finish, { once: true });
    image.addEventListener('error', finish, { once: true });

    if (typeof image.decode === 'function') {
      image.decode().then(finish).catch(() => undefined);
    }
  });
}

async function waitForBrochureAssets(rootId: string) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(images.map((image) => waitForImageAsset(image)));

  if ('fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font readiness failures and continue the export.
    }
  }

  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

export function PropertyBrochureButton({ brochure, children }: BrochureButtonProps) {
  const [isPreparing, setIsPreparing] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const gallery = useMemo(
    () => (brochure.gallery || []).filter(Boolean).slice(0, 4),
    [brochure.gallery],
  );
  const summary = truncateText(brochure.description || 'Property details available on request.', 900);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  function handleDownload(event: MouseEvent<HTMLDivElement>) {
    void startDownload(event);
  }

  async function startDownload(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsPreparing(true);

    try {
      await waitForBrochureAssets('aether-brochure-print-root');
      await new Promise((resolve) => setTimeout(resolve, 150));
      window.print();
    } finally {
      setTimeout(() => setIsPreparing(false), 300);
    }
  }

  return (
    <>
      <div onClick={handleDownload} className="w-full cursor-pointer">
        {cloneElement(children, {
          disabled: isPreparing,
          children: isPreparing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              PREPARING...
            </span>
          ) : (
            children.props.children
          ),
        })}
      </div>

      {hasMounted
        ? createPortal(
            <div
              id="aether-brochure-print-root"
              aria-hidden="true"
              className="pointer-events-none fixed top-0 z-[-1] h-[297mm] w-[210mm] overflow-hidden bg-white text-slate-900 opacity-0 print:pointer-events-auto print:left-0 print:z-[99999] print:opacity-100"
              style={{ left: '-99999px' }}
            >
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                    @media print {
                      @page {
                        size: A4 portrait;
                        margin: 0 !important;
                      }
                      html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        overflow: hidden !important;
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                      }
                      body > *:not(#aether-brochure-print-root) {
                        display: none !important;
                      }
                      #aether-brochure-print-root {
                        display: block !important;
                        position: fixed !important;
                        inset: 0 !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        background: white !important;
                        z-index: 999999 !important;
                        opacity: 1 !important;
                        pointer-events: auto !important;
                      }
                    }
                  `,
                }}
              />

              <div className="flex h-[297mm] w-[210mm] flex-col overflow-hidden bg-white">
                <div className="flex items-center justify-between bg-black px-10 py-7 text-white">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.45em] text-[#B8860B]">Signature Listing</p>
                    <h1 className="mt-3 text-[26px] font-bold uppercase tracking-tight">{brochure.title}</h1>
                    {brochure.subtitle ? (
                      <p className="mt-3 flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-white/75">
                        <MapPin className="h-4 w-4 text-[#B8860B]" />
                        {brochure.subtitle}
                      </p>
                    ) : null}
                  </div>
                  {brochure.priceLabel ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-right">
                      <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-white/60">Guide Price</p>
                      <p className="mt-2 text-2xl font-bold text-white">{brochure.priceLabel}</p>
                    </div>
                  ) : null}
                </div>

                <div className="relative h-[94mm] w-full bg-slate-100">
                  {brochure.heroImage ? (
                    <img
                      src={brochure.heroImage}
                      alt={brochure.title}
                      className="h-full w-full object-cover"
                      crossOrigin="anonymous"
                      loading="eager"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>

                <div className="grid flex-1 grid-cols-[1.55fr_0.9fr]">
                  <div className="flex flex-col gap-8 px-10 py-8">
                    {brochure.stats && brochure.stats.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {brochure.stats.slice(0, 3).map((stat) => (
                          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                            <p className="mt-2 text-lg font-bold text-slate-900">{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {gallery.length > 1 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {gallery.slice(1).map((image, index) => (
                          <div key={`${image}-${index}`} className="h-[52mm] overflow-hidden rounded-2xl bg-slate-100">
                            <img
                              src={image}
                              alt={`${brochure.title} view ${index + 2}`}
                              className="h-full w-full object-cover"
                              crossOrigin="anonymous"
                              loading="eager"
                            />
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#B8860B]">Property Overview</p>
                      <p className="mt-4 whitespace-pre-line text-[11px] leading-6 text-slate-600">
                        {summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between bg-[#FAF7F2] px-8 py-8">
                    <div>
                      <div className="rounded-[28px] border border-[#EADCC3] bg-white px-6 py-7 text-center shadow-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#B8860B]/10 text-[#B8860B]">
                          {brochure.agentImage ? (
                            <img
                              src={brochure.agentImage}
                              alt={brochure.agentName || 'Listing specialist'}
                              className="h-full w-full rounded-full object-cover"
                              crossOrigin="anonymous"
                              loading="eager"
                            />
                          ) : (
                            <Building2 className="h-9 w-9" />
                          )}
                        </div>
                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                          {brochure.agentName || brochure.organizationName || 'Property Specialist'}
                        </h2>
                        <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                          {brochure.agentTitle || 'Luxury Property Consultant'}
                        </p>
                      </div>

                      <div className="mt-8 space-y-5">
                        {brochure.organizationName ? (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">Agency</p>
                            <p className="mt-2 text-sm font-semibold text-slate-700">{brochure.organizationName}</p>
                          </div>
                        ) : null}
                        {brochure.contactPhone ? (
                          <div>
                            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">
                              <Phone className="h-3.5 w-3.5" />
                              Contact
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-700">{brochure.contactPhone}</p>
                          </div>
                        ) : null}
                        {brochure.contactEmail ? (
                          <div>
                            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">
                              <Mail className="h-3.5 w-3.5" />
                              Email
                            </p>
                            <p className="mt-2 break-all text-sm font-semibold text-slate-700">{brochure.contactEmail}</p>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-[24px] bg-black px-6 py-6 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#B8860B]">Advisory Note</p>
                      <p className="mt-4 text-sm leading-6 text-white/85">
                        Prepared for a premium client conversation with pricing context, gallery highlights, and direct follow-up details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
