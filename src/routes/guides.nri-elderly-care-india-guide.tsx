import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/marketing/PageShell";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Phone, Globe, HeartPulse, Clock, MapPin, Check } from "lucide-react";

export const Route = createFileRoute("/guides/nri-elderly-care-india-guide")({
  head: () => ({
    meta: [
      { title: "Elderly Care in India: A Complete Guide for NRI Families | Close Eye" },
      { name: "description", content: "Practical guide for NRI families managing elderly care in India from abroad. Learn about wellbeing visits, trust, emergency coordination, and how Close Eye supports your parents remotely." },
      { property: "og:title", content: "Elderly Care in India: A Complete Guide for NRI Families" },
      { property: "og:description", content: "Practical guide for NRI families managing elderly care in India from abroad. Trusted local support when you cannot be there." },
      { property: "og:url", content: "https://closeeye.online/guides/nri-elderly-care-india-guide" },
      { property: "og:type", content: "article" },
    ],
    links: [
      { rel: "canonical", href: "https://closeeye.online/guides/nri-elderly-care-india-guide" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Elderly Care in India: A Complete Guide for NRI Families",
          description: "Practical guide for NRI families managing elderly care in India from abroad.",
          author: { "@type": "Organization", name: "Close Eye" },
          publisher: { "@type": "Organization", name: "Close Eye", logo: { "@type": "ImageObject", url: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d09f877f-144f-497c-8251-b839a09388de" } },
          url: "https://closeeye.online/guides/nri-elderly-care-india-guide",
          mainEntityOfPage: { "@type": "WebPage", "@id": "https://closeeye.online/guides/nri-elderly-care-india-guide" },
        }),
      },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  return (
    <PageShell
      eyebrow="Guide"
      title="Elderly Care in India: A Complete Guide for NRI Families"
      intro="Managing elderly care in India while living abroad is one of the hardest parts of being an NRI. This guide covers the real challenges — and how the wellbeing visit model helps families stay connected, informed, and at peace."
    >
      <article className="prose prose-lg max-w-none">
        {/* Intro */}
        <section className="mb-16">
          <p className="text-muted-foreground leading-relaxed">
            If you are an NRI with aging parents in India, you know the feeling. The 3 AM worry. The unanswered phone call. The helplessness of being thousands of miles away when your mother mentions she has not been feeling well, or when your father forgets his medication schedule.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Elderly care in India presents unique challenges for families living abroad. The healthcare system, while excellent in major cities, can be difficult to navigate remotely. Trusting local help is hard when you cannot meet them in person. And emergencies do not wait for your next India trip.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            This guide is built from conversations with over 100 NRI families. It covers the real challenges — and introduces the wellbeing visit model as a practical, trust-based solution.
          </p>
        </section>

        {/* Challenges */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl text-primary tracking-tight">The Real Challenges NRI Families Face</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              { icon: Shield, title: "Trust in Local Help", text: "How do you verify that a paid companion, driver, or domestic help is actually looking after your parents — and not taking advantage of their isolation? Most families rely on distant relatives or neighbours, which creates awkward obligations and inconsistent care." },
              { icon: Phone, title: "Emergency Coordination", text: "When something goes wrong at 2 AM your time, who picks up the phone in India? Who accompanies your parent to the hospital? Who translates doctor instructions? Without a trusted local contact, every emergency becomes a panic." },
              { icon: Globe, title: "Healthcare Navigation", text: "Finding the right specialist, scheduling appointments, and understanding diagnoses is hard enough in person. From abroad, it is overwhelming. Many NRIs do not know which hospitals their parents should go to, or whether a recommended treatment is appropriate." },
              { icon: HeartPulse, title: "Loneliness & Isolation", text: "Physical distance creates emotional distance. Parents often hide their struggles to avoid worrying their children. Meanwhile, NRIs feel guilty for missing birthdays, festivals, and the small moments that matter most." },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="h-10 w-10 rounded-xl bg-brand-accent/15 border border-brand-accent/25 flex items-center justify-center">
                  <c.icon className="h-5 w-5 text-brand-accent" />
                </div>
                <h3 className="mt-4 font-medium text-primary">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What is a wellbeing visit */}
        <section className="mb-16 rounded-3xl bg-brand-radial text-brand-foreground p-10 md:p-14">
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight">What Is a Wellbeing Visit?</h2>
          <p className="mt-4 max-w-3xl text-brand-foreground/80 leading-relaxed">
            A wellbeing visit is a scheduled, in-person check-in by a verified, trained companion who visits your parent at home. It is not a medical checkup, nor is it a casual neighbour dropping by. It is a structured, accountable interaction designed specifically for families who cannot be there.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { icon: Clock, title: "Scheduled & Reliable", text: "Visits happen at agreed times — weekly, bi-weekly, or monthly — so your parents have something to look forward to." },
              { icon: MapPin, title: "Verified & Trained", text: "Every companion goes through background checks, interviews, and training in first-response basics and elderly engagement." },
              { icon: Check, title: "Reported & Transparent", text: "You receive photos, notes, and a wellbeing summary within the hour — no guessing, no relying on second-hand information." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-brand-foreground/5 border border-brand-foreground/10 p-6">
                <item.icon className="h-6 w-6 text-brand-accent" />
                <h3 className="mt-3 font-medium">{item.title}</h3>
                <p className="mt-2 text-sm text-brand-foreground/70 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How Close Eye helps */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl text-primary tracking-tight">How Close Eye Supports NRI Families</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed max-w-3xl">
            Close Eye was built by people who have lived this exact reality. We are not a generic home-care agency. We are a presence-on-demand service designed for NRIs who need reliable, trustworthy eyes and ears on the ground.
          </p>
          <div className="mt-8 space-y-6">
            {[
              { title: "5-Layer Verification", text: "Every companion is police-cleared, identity-verified, reference-checked, and personally interviewed before they ever meet a family." },
              { title: "Real-Time Reporting", text: "After every visit, you receive a time-stamped report with photos, notes on mood and health, and any observations about the home environment." },
              { title: "Emergency Protocol Built In", text: "Your companion knows your emergency contacts, preferred hospital, and doctor details. If something feels off, they act immediately — and you are notified within minutes, not hours." },
              { title: "No Cash, No Keys", text: "Companions never handle money or hold house keys unsupervised. All coordination flows through the platform, creating an audit trail and removing risk." },
              { title: "Dedicated Companion Matching", text: "Where possible, the same companion visits each time. They build rapport with your parent, remember preferences, and spot changes in behaviour or health that a stranger would miss." },
            ].map((item, i) => (
              <div key={item.title} className="flex gap-4 items-start rounded-xl border border-border bg-card p-6 shadow-soft">
                <div className="mt-0.5 h-8 w-8 rounded-full bg-brand-accent/15 flex items-center justify-center text-brand font-medium text-sm shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-medium text-primary">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Practical tips */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl text-primary tracking-tight">Practical Tips for Managing Elderly Care from Abroad</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              { title: "Create a Medical Folder", text: "Keep a shared digital folder with your parents' prescriptions, doctor contacts, insurance details, and medical history. Share access with your companion and a trusted relative." },
              { title: "Set a Regular Call Schedule", text: "Predictable communication helps parents feel connected and gives you early signals if something changes in their routine or mood." },
              { title: "Use Video, Not Just Voice", text: "Video calls let you see your parent's face, home environment, and energy level — clues that audio alone cannot provide." },
              { title: "Plan Your India Visits Strategically", text: "Use in-person trips to meet your companion, review the care plan, and handle tasks that require physical presence — medical appointments, home repairs, banking." },
              { title: "Build a Local Network", text: "Even with a companion, maintain relationships with a neighbour, building security, and a local relative who can respond in extreme emergencies." },
              { title: "Monitor Finances Gently", text: "Set up account alerts, review statements periodically, and ensure your parents are not being pressured into financial decisions." },
            ].map((tip) => (
              <div key={tip.title} className="rounded-xl border border-border bg-cream p-6">
                <h3 className="font-medium text-primary">{tip.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl text-primary tracking-tight">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            {[
              { q: "Is a wellbeing visit the same as hiring a nurse?", a: "No. A wellbeing visit is a social and observational check-in, not a medical service. Companions are trained to notice changes in health, mood, and safety, but they do not administer medication or provide clinical care. For medical needs, we help families coordinate with local healthcare providers." },
              { q: "How do I know the companion is actually visiting?", a: "Every visit generates a time-stamped report with photos taken at your parent's home, GPS-verified location, and detailed notes. You receive this within an hour of the visit ending." },
              { q: "What if my parent does not like the companion?", a: "We match companions carefully based on personality, language, and preferences. If the fit is not right, we replace them within 24 hours — at no extra cost." },
              { q: "Can I request a visit for a specific day or emergency?", a: "Yes. Planned visits can be scheduled for specific dates and times. Emergency visits are dispatched within a few hours, depending on the city." },
              { q: "Which cities do you cover?", a: "We are active in 12 cities including Bengaluru, Mumbai, Delhi NCR, Pune, Hyderabad, Chennai, and Kolkata. We are expanding rapidly based on waitlist demand." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-medium text-primary">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-brand-radial text-brand-foreground p-10 md:p-14 text-center">
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight max-w-3xl mx-auto">
            You cannot be there every day. Close Eye can.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-brand-foreground/80 leading-relaxed">
            Join the NRI families who have traded worry for peace of mind. A verified companion, a real report, and the confidence that someone trustworthy is looking after your parents in India.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Button asChild size="lg" className="bg-brand-accent text-primary hover:bg-brand-accent/90 h-12 px-6 text-base">
              <Link to="/waitlist">Join Waitlist <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-brand-foreground/30 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground h-12 px-6 text-base">
              <Link to="/contact">Book a call</Link>
            </Button>
          </div>
        </section>
      </article>
    </PageShell>
  );
}
