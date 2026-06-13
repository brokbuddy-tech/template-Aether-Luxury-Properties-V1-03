"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitContactInquiryAction } from "@/app/actions/submit-inquiry";
import { getEffectiveAgencySlug } from "@/lib/agency-routing";

const POPUP_STORAGE_KEY = "aetherLuxuryContactPopupClosed";
const POPUP_DELAY_MS = 40_000;

function markPopupSeen(value: "shown" | "closed" | "submitted") {
  try {
    window.sessionStorage.setItem(POPUP_STORAGE_KEY, value);
  } catch {
    // Some privacy modes disable storage; the modal still works for this session.
  }
}

function hasPopupBeenSeen() {
  try {
    return Boolean(window.sessionStorage.getItem(POPUP_STORAGE_KEY));
  } catch {
    return false;
  }
}

export function AetherLuxuryContactPopup() {
  const agencySlug = getEffectiveAgencySlug();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (hasPopupBeenSeen()) return;

    const timer = window.setTimeout(() => {
      if (hasPopupBeenSeen()) return;
      markPopupSeen("shown");
      setIsOpen(true);
    }, POPUP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    if (!nextOpen) {
      markPopupSeen("closed");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await submitContactInquiryAction({
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        message: String(formData.get("message") || "").trim(),
        templateName: "Aether Luxury Properties",
        formContext: "timed-contact-popup",
        agencySlug,
      });

      markPopupSeen("submitted");
      form.reset();
      setIsOpen(false);
      toast({
        title: "Request received",
        description: "A private advisor will contact you shortly.",
      });
    } catch (error) {
      toast({
        title: "Unable to send request",
        description: error instanceof Error ? error.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border border-slate-200 bg-white p-0 text-slate-950 shadow-xl sm:max-w-2xl sm:rounded-xl [&>button]:right-5 [&>button]:top-5 [&>button]:rounded-md [&>button]:border [&>button]:border-slate-200 [&>button]:bg-white [&>button]:p-3 [&>button]:!text-slate-500 [&>button]:opacity-100 [&>button]:shadow-sm [&>button]:ring-offset-white [&>button:hover]:border-teal-700 [&>button:hover]:!text-teal-700">
        <div className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-white" />

          <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
            <div className="hidden border-r border-slate-200 bg-slate-50 p-8 md:flex md:flex-col md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-teal-700">
                  Private advisory
                </p>

                <h3 className="mt-8 font-headline text-4xl font-bold leading-tight text-slate-950">
                  A quieter way to begin.
                </h3>
              </div>

              <p className="text-sm leading-7 text-slate-500">
                Share your brief and a specialist will respond with a tailored next step.
              </p>
            </div>

            <div className="bg-white p-7 sm:p-10">
              <DialogHeader className="pr-10 text-left">
                <DialogTitle className="font-headline text-3xl font-bold uppercase tracking-[0.16em] text-slate-950 sm:text-4xl">
                  Contact Us
                </DialogTitle>

                <DialogDescription className="mt-3 text-sm leading-7 text-slate-500">
                  Tell us what you are looking for and our advisory team will follow up discreetly.
                </DialogDescription>
              </DialogHeader>

              <form
                className="mt-8 space-y-5"
                method="post"
                action="#"
                noValidate
                onSubmit={handleSubmit}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    name="name"
                    required
                    placeholder="Full name"
                    className="h-12 rounded-md border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-teal-700 focus-visible:ring-teal-700"
                  />

                  <Input
                    name="email"
                    type="email"
                    required
                    placeholder="Email address"
                    className="h-12 rounded-md border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-teal-700 focus-visible:ring-teal-700"
                  />
                </div>

                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  className="h-12 rounded-md border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-teal-700 focus-visible:ring-teal-700"
                />

                <Textarea
                  name="message"
                  required
                  minLength={10}
                  placeholder="Tell us about your property interest..."
                  className="min-h-[130px] resize-none rounded-md border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-teal-700 focus-visible:ring-teal-700"
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-14 w-full rounded-md bg-teal-700 text-sm font-medium text-white shadow-sm hover:bg-teal-800 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending
                    </>
                  ) : (
                    "Send Request"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
