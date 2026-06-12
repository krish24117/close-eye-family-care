import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";

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
