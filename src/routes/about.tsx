import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/marketing/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Close Eye" },
      { name: "description", content: "Close Eye is your trusted presence in India for loved ones living far from you. Founded in Hyderabad to support NRI families." },
      { property: "og:title", content: "About — Close Eye" },
      { property: "og:description", content: "Built for families abroad, trusted in India. A local presence for parents and grandparents living far from you." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="Built for families abroad, trusted in India."
      intro="Close Eye started with one question — who is looking after my family when I can't get there? We built the network of verified local companions we wished we had."
    >
      <div className="prose-lg max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <p>
          Close Eye was founded in Hyderabad by Krishna, a serial entrepreneur
          who has built and exited ventures across construction, fintech, and
          technology. Like many families, he found himself asking a question
          that had no good answer — who is looking after my family when I can't
          get there?
        </p>
        <p>
          The existing options were fragmented: paid domestic help with no
          accountability, alert apps that couldn't hold a conversation, and
          elderly care services designed for full-time residents, not for
          families spread across time zones.
        </p>
        <p>
          Close Eye was built to fill that gap. Not as a technology substitute
          for family, but as a trusted local presence — warm, verified, and
          accountable.
        </p>

        <h2 className="font-serif text-2xl text-primary mt-12">Our principles</h2>
        <ul className="space-y-3 list-none pl-0">
          {[
            ["Real people, real visits.", "Every companion is background-checked, trained, and personally onboarded. No gig economy shortcuts."],
            ["Radical transparency.", "Every visit generates a time-stamped photo report delivered within the hour. No filler, no delays."],
            ["Designed for trust.", "Your family's data and your loved one's privacy are our most important product features — not afterthoughts."],
            ["Built for NRI families.", "We understand the guilt, the distance, and the complexity of coordinating care from abroad. Everything we build starts from that reality."],
          ].map(([t, d]) => (
            <li key={t}>
              <span className="font-medium text-foreground">{t}</span>{" "}
              <span>{d}</span>
            </li>
          ))}
        </ul>

        <h2 className="font-serif text-2xl text-primary mt-12">Where we operate</h2>
        <p>
          Currently serving families in Hyderabad, with Bengaluru, Chennai,
          Mumbai, and Delhi in active expansion. Join the waitlist and we will
          notify you the moment we are live in your loved one's city.
        </p>

        <p className="text-xs text-muted-foreground/80 pt-8 border-t border-border mt-12">
          Close Eye is a venture under Stexa Products &amp; Services Pvt. Ltd., Hyderabad.
        </p>
      </div>
    </PageShell>
  );
}
