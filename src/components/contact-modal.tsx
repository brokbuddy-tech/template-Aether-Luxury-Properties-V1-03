
"use client";

import { useContactModal } from '@/hooks/use-contact-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function ContactModal() {
  const { isOpen, closeModal } = useContactModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="bg-black/50 backdrop-blur-lg border-white/20 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Contact Us</DialogTitle>
          <DialogDescription className="text-white/80">
            Let's connect. Fill out the form below and one of our experts will be in touch shortly.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" className="bg-black/20 border-white/30 placeholder:text-gray-400 focus-visible:ring-accent" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="john.doe@example.com" className="bg-black/20 border-white/30 placeholder:text-gray-400 focus-visible:ring-accent" />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-black/20 border-white/30 placeholder:text-gray-400 focus-visible:ring-accent" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="I'm interested in learning more about..." className="bg-black/20 border-white/30 placeholder:text-gray-400 focus-visible:ring-accent" />
          </div>
          <Button type="submit" className="w-full mt-2 bg-accent hover:bg-accent/90 text-accent-foreground">Send Message</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
