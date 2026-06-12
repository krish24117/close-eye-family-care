import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Linkedin, Youtube, MessageCircle } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/closeeye.in", icon: Instagram },
  { label: "Facebook", href: "https://facebook.com/closeeye.in", icon: Facebook },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/closeeye", icon: Linkedin },
  { label: "YouTube", href: "https://youtube.com/@closeeye", icon: Youtube },
  { label: "WhatsApp", href: "https://wa.me/919000221261", icon: MessageCircle },
  {
    label: "X",
    href: "https://x.com/closeeye_in",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M18.244 2H21l-6.52 7.45L22 22h-6.797l-4.74-6.19L4.8 22H2.04l6.98-7.98L2 2h6.914l4.29 5.67L18.244 2zm-2.39 18h1.88L7.27 4H5.27l10.584 16z" />
      </svg>
    ),
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo size="md" />
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              Verified wellbeing visits and trusted local support for your loved
              ones in India. When you can't be there, Close Eye can.
            </p>
            <div className="mt-6">
              <h4 className="text-xs tracking-widest uppercase text-muted-foreground">Follow Close Eye</h4>
              <ul className="mt-3 flex flex-wrap items-center gap-2">
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground/70 hover:text-brand hover:border-brand transition-colors"
                    >
                      <s.icon className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Get started</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/waitlist" className="hover:text-foreground">Join Waitlist</Link></li>
              <li><Link to="/auth" className="hover:text-foreground">Sign in</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Book a call</Link></li>
              <li><a href="https://wa.me/919000221261" className="hover:text-foreground" target="_blank" rel="noopener noreferrer">WhatsApp +91 90002 21261</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground tracking-wider uppercase">
            Made with care in India
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Close Eye. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
