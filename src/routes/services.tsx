import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, ShieldCheck, Stethoscope, Sparkles } from "lucide-react";
import { PageShell } from "@/components/marketing/PageShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Close Eye" },
      { name: "description", content: "Companion visits, hospital companion, emergency visits and ongoing care support for loved ones in India." },
      { property: "og:title", content: "Services — Close Eye" },
      { property: "og:description", content: "Wellbeing visits, hospital companion and emergency support across India." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: [
            {
              "@type": "Service",
              name: "Companion Visit",
              description: "A friendly home visit, warm conversation, basic wellbeing and home-safety check, photos and a detailed report shared with the family.",
              provider: { "@type": "Organization", name: "Close Eye" },
              areaServed: "India",
              offers: { "@type": "Offer", price: "999", priceCurrency: "INR" },
            },
            {
              "@type": "Service",
              name: "Hospital Companion",
              description: "A trusted companion accompanies your loved one to a hospital or doctor appointment and updates the family throughout.",
              provider: { "@type": "Organization", name: "Close Eye" },
              areaServed: "India",
              offers: { "@type": "Offer", price: "1499", priceCurrency: "INR" },
            },
            {
              "@type": "Service",
              name: "Emergency Visit",
              description: "Rapid on-ground support when something feels off — a verified person at the door within hours.",
              provider: { "@type": "Organization", name: "Close Eye" },
              areaServed: "India",
              offers: { "@type": "Offer", price: "1999", priceCurrency: "INR" },
            },
            {
              "@type": "Service",
              name: "Care Plan — Monthly",
              description: "Recurring monthly visits — 4, 8 or 12 per month — with the same companion where possible and priority emergency support.",
              provider: { "@type": "Organization", name: "Close Eye" },
              areaServed: "India",
              offers: { "@type": "Offer", price: "2999", priceCurrency: "INR" },
            },
          ],
        }),
      },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: HeartHandshake, price: "₹999", priceId: "companion_visit_single", title: "Companion Visit", desc: "A friendly home visit, warm conversation, basic wellbeing and home-safety check, photos and a detailed report shared with the family." , includes: ["60–90 minute visit", "Wellbeing & mood check", "Photos and notes", "Detailed report on dashboard & WhatsApp"] },
  { icon: Stethoscope, price: "₹1,499", priceId: "hospital_companion_single", title: "Hospital Companion", desc: "A trusted companion accompanies your loved one to a hospital or doctor appointment and updates the family throughout.", includes: ["Pickup & drop coordination", "Companion through appointment", "Doctor instructions captured", "Photos of prescriptions / reports"] },
  { icon: ShieldCheck, price: "₹1,999", priceId: "emergency_visit_single", title: "Emergency Visit", desc: "Rapid on-ground support when something feels off — a verified person at the door within hours.", includes: ["Priority dispatch", "Live updates to family", "Coordination with neighbours", "Follow-up visit included"] },
  { icon: Sparkles, price: "from ₹2,999 / mo", priceId: "care_plan_4_monthly", title: "Care Plan — Monthly", desc: "Recurring monthly visits — 4, 8 or 12 per month — with the same companion where possible and priority emergency support.", includes: ["Recurring schedule", "Same companion where possible", "Monthly summary report", "Priority emergency support"] },
];

function ServicesPage() {
  return (
    <PageShell
      eyebrow="Services"
      title="A trusted presence, on the days you cannot be there."
      intro="Choose a one-off visit or a recurring care plan. Every service includes a verified local companion, photos and a full report."
    >
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm text-primary">
        Currently serving Hyderabad — joining other cities soon.
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <article key={s.title} className="rounded-2xl border border-border bg-card p-8 shadow-soft flex flex-col">
            <s.icon className="h-7 w-7 text-brand" />
            <div className="mt-5 text-xs tracking-widest uppercase text-muted-foreground">{s.price}</div>
            <h2 className="mt-2 font-serif text-2xl text-primary">{s.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            <ul className="mt-5 space-y-2 flex-1">
              {s.includes.map((i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-accent" />
                  <span className="text-muted-foreground">{i}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 w-full">
              <Link to="/waitlist">Join Waitlist</Link>
            </Button>
          </article>
        ))}
      </div>
      <div className="mt-16 rounded-2xl bg-brand-radial text-brand-foreground p-10 text-center">
        <h2 className="font-serif text-3xl">Not sure where to start?</h2>
        <p className="mt-3 text-brand-foreground/80">Tell us about your family and we'll recommend the right care plan.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild size="lg" className="bg-brand-accent text-primary hover:bg-brand-accent/90 h-12 px-6 text-base">
            <Link to="/waitlist">Join Waitlist</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-brand-foreground/30 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground h-12 px-6 text-base">
            <Link to="/contact">Book a call</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
