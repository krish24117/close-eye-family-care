import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/marketing/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Close Eye" },
      { name: "description", content: "Close Eye is your trusted presence in India for loved ones living far from you." },
      { property: "og:title", content: "About — Close Eye" },
      { property: "og:description", content: "Built by NRIs, for NRI families. A trusted local presence for parents, grandparents and family in India." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="Built by NRIs, for NRI families."
      intro="Close Eye started with one question — how do we look after our parents in India when we live thousands of miles away? We built the network of verified companions we wished we had."
    >
      <div className="prose-lg max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <p>
          Close Eye is a Family Wellbeing Visit and Care Support service designed
          for families living apart from their loved ones in India. We send a
          warm, verified local companion to your loved one's home for a friendly
          check-in — and you receive a detailed report with real photos within
          hours.
        </p>
        <p>
          We are not a clinic, not a call centre, not an alert app. We are a
          human presence. Tea, a chat, a quick check on medicines, a walk to the
          doctor — whatever helps your family feel close from afar.
        </p>
        <h2 className="font-serif text-2xl text-primary mt-12">Our principles</h2>
        <ul className="space-y-3 list-none pl-0">
          {[
            ["Real people, real visits.", "Every companion is background-checked, trained and personally onboarded."],
            ["Radical transparency.", "Every visit comes with photos, notes and a wellbeing score. No filler."],
            ["Built for trust.", "Your family's data and your loved one's privacy are our most important product features."],
          ].map(([t, d]) => (
            <li key={t}>
              <span className="font-medium text-foreground">{t}</span>{" "}
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
