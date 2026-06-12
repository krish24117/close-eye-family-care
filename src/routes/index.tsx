import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Camera, Check, FileText, HeartHandshake, MapPin, ShieldCheck, Stethoscope, Search, ClipboardCheck, RefreshCw, Hospital, Lock } from "lucide-react";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Logo, SparkleMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Close Eye — When you can't be there, Close Eye can." },
      { name: "description", content: "Trusted Family Wellbeing Visits & Support for loved ones in India. Real visits, real photos, real reports." },
      { property: "og:title", content: "Close Eye — Your trusted presence in India" },
      { property: "og:description", content: "Trusted Family Wellbeing Visits & Support for loved ones in India." },
    ],
  }),
  component: HomePage,
});

const services = [
  {
    icon: HeartHandshake,
    title: "Companion Visit",
    price: "₹999 onwards",
    desc: "A friendly home visit, warm conversation, basic needs check and a detailed wellbeing report with photos.",
  },
  {
    icon: Stethoscope,
    title: "Hospital Companion",
    price: "₹1,499 per visit",
    desc: "A companion accompanies your loved one to a hospital appointment and shares an update with the family.",
  },
  {
    icon: ShieldCheck,
    title: "Emergency Visit",
    price: "On request",
    desc: "Rapid on-ground support when something feels off — a verified person at the door within hours.",
  },
];

const steps = [
  { n: "01", t: "Tell us about your loved one", d: "Create a profile with their address, preferences and emergency contacts." },
  { n: "02", t: "Request a visit", d: "Choose a visit type and time. We match a verified local companion in their city." },
  { n: "03", t: "Receive a real report", d: "Photos, notes and a wellbeing summary land in your dashboard and on WhatsApp." },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-radial text-brand-foreground">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-accent/30 bg-brand-foreground/5 px-3 py-1 text-xs tracking-widest uppercase text-brand-accent">
              <SparkleMark className="h-3 w-3" /> Trusted by NRI families across 5 countries
            </div>
            <h1 className="mt-8 font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-5xl">
              When you can't be there,
              <br />
              <em className="not-italic text-brand-accent">Close Eye</em> can.
            </h1>
            <p className="mt-6 font-serif text-xl md:text-2xl text-brand-foreground/90 max-w-3xl">
              A Support System, Not A Replacement
            </p>
            <p className="mt-4 max-w-2xl text-base md:text-lg text-brand-foreground/70 leading-relaxed">
              Nothing can replace the love and presence of family. Close Eye exists to support families, helping them stay connected, informed, and involved when distance makes it difficult to be there in person.
            </p>
            <p className="mt-3 max-w-2xl text-sm md:text-base text-brand-foreground/60 leading-relaxed">
              Verified wellbeing visits and trusted local support for your loved ones in India. Real visits. Real photos. Real reports. Real peace of mind.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-brand-accent text-primary hover:bg-brand-accent/90 h-12 px-6 text-base">
                <Link to="/waitlist">Join Waitlist <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-brand-foreground/30 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground h-12 px-6 text-base">
                <Link to="/contact">Book a call</Link>
              </Button>
            </div>
            <p className="mt-6 text-xs tracking-widest uppercase text-brand-foreground/60">
              USA · UK · UAE · CA · AU
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ["100+", "NRI families served"],
            ["12 cities", "across India"],
            ["4.9★", "family satisfaction"],
            ["24/7", "emergency support"],
          ].map(([n, l]) => (
            <div key={l} className="text-center md:text-left">
              <div className="font-serif text-3xl md:text-4xl text-primary">{n}</div>
              <div className="mt-1 text-sm text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-2xl">
          <p className="text-xs tracking-widest uppercase text-brand">Our services</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl tracking-tight">
            A trusted presence, on the days you cannot be there.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <article key={s.title} className="group rounded-2xl border border-border bg-card p-8 shadow-soft hover:shadow-elevated transition-shadow">
              <s.icon className="h-7 w-7 text-brand" />
              <div className="mt-6 text-xs tracking-widest uppercase text-muted-foreground">{s.price}</div>
              <h3 className="mt-2 font-serif text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Why families trust us */}
      <section className="bg-primary text-brand-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-widest uppercase text-brand-accent">Why families trust us</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl tracking-tight">
              We don't just send someone. <em className="not-italic text-brand-accent">We send the right someone.</em>
            </h2>
            <p className="mt-5 text-brand-foreground/70 leading-relaxed">
              Every Close Eye companion goes through a process most platforms skip entirely. Here's what happens before anyone meets your family.
            </p>
          </div>

          <div className="mt-14 grid gap-px bg-brand-foreground/10 border border-brand-foreground/10 rounded-2xl overflow-hidden md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Search, t: "5-Layer Background Verification", d: "Police clearance, address verification, identity checks, employment history and two personal references — every companion, no exceptions.", b: "Verified before Day 1" },
              { icon: ClipboardCheck, t: "Trained for Elder Companionship", d: "Companions are trained in first-response basics, medication reminders and emotional engagement — not just errand running.", b: "Certified & supervised" },
              { icon: Camera, t: "Photo-Verified Visit Reports", d: "Every visit generates a time-stamped report with photos, notes and a wellbeing summary — sent to you within the hour.", b: "Real-time accountability" },
              { icon: RefreshCw, t: "Guaranteed Replacement in 24hrs", d: "If your companion is ever unavailable, we arrange a briefed replacement within 24 hours — your parents never experience a gap in care.", b: "Zero-gap guarantee" },
              { icon: Hospital, t: "Emergency Protocol Built In", d: "Every companion knows your family's doctor, nearest hospital and your emergency contact. No guesswork in a crisis.", b: "Pre-briefed always" },
              { icon: Lock, t: "No Cash, No Keys — Ever", d: "Companions never handle cash or hold property keys unsupervised. All payments flow through the platform. Trust by design.", b: "Structural safeguard" },
            ].map((c) => (
              <article key={c.t} className="bg-primary p-8 hover:bg-primary/80 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-brand-accent/15 border border-brand-accent/25 flex items-center justify-center">
                  <c.icon className="h-5 w-5 text-brand-accent" />
                </div>
                <h3 className="mt-5 font-medium text-brand-foreground">{c.t}</h3>
                <p className="mt-2 text-sm text-brand-foreground/70 leading-relaxed">{c.d}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                  {c.b}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-px bg-brand-foreground/10 border border-brand-foreground/10 rounded-xl overflow-hidden">
            {[
              ["47+", "Families on waitlist"],
              ["100%", "Background-checked"],
              ["<1hr", "Report delivery"],
            ].map(([n, l]) => (
              <div key={l} className="bg-primary p-6 text-center">
                <div className="font-serif text-3xl md:text-4xl text-brand-accent">{n}</div>
                <div className="mt-1 text-xs md:text-sm text-brand-foreground/70">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="bg-cream border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <p className="text-xs tracking-widest uppercase text-brand">How it works</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl tracking-tight">
              Three steps to real peace of mind.
            </h2>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <div className="font-serif text-5xl text-brand-accent">{s.n}</div>
                <h3 className="mt-4 font-serif text-2xl text-primary">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / proof */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-brand">
              <Camera className="h-4 w-4" /> Visit completed
            </div>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl tracking-tight">
              "Mom is doing great."
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              "Had a lovely tea with auntie today. She's looking forward to your call tonight."
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-medium">PS</div>
              <div>
                <div className="text-sm font-medium">Priya Sharma</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Companion · Bengaluru</div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-elevated">
            <FileText className="h-6 w-6 text-brand" />
            <h3 className="mt-4 font-serif text-2xl">Sample wellbeing report</h3>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Mood & general wellbeing",
                "Health & medication check",
                "Home & safety observations",
                "Photos from the visit",
                "Notes for the family",
              ].map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-accent" />
                  <span className="text-muted-foreground">{i}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl bg-brand-radial text-brand-foreground p-10 md:p-16 text-center">
          <Logo tone="light" size="lg" />
          <h2 className="mt-8 font-serif text-3xl md:text-5xl tracking-tight max-w-3xl mx-auto">
            Join the families we look after across India.
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Button asChild size="lg" className="bg-brand-accent text-primary hover:bg-brand-accent/90">
              <Link to="/waitlist">Join Waitlist</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-brand-foreground/30 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground">
              <Link to="/contact">Book a call</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
