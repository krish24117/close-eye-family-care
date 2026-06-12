import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/marketing/PageShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Close Eye" },
      { name: "description", content: "Answers to common questions about Close Eye wellbeing visits, pricing, companions and coverage." },
      { property: "og:title", content: "FAQ — Close Eye" },
      { property: "og:description", content: "Common questions about Close Eye visits and care support." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is a Close Eye visit?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "A Close Eye visit is a friendly, in-person home call by a verified local companion. They spend 60–90 minutes with your loved one — sharing tea, checking on their mood and health, doing a basic home-safety walk-through, and making sure medications are in order. Within an hour of the visit, you receive a detailed report with time-stamped photos on your dashboard and WhatsApp. It is not a medical service — it is a warm human presence, with professional accountability built in.",
              },
            },
            {
              "@type": "Question",
              name: "Where in India do you operate?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We are currently serving families in Hyderabad and are actively expanding to Bengaluru, Chennai, Mumbai, Delhi, Pune, and other major cities. If your loved one is in a city not yet listed, join the waitlist — we prioritise new cities based on demand and will notify you the moment we're operational near them.",
              },
            },
            {
              "@type": "Question",
              name: "Are companions verified?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes — every companion goes through a 5-layer verification process before their first visit. This includes a police clearance certificate, government-issued identity verification, permanent address confirmation, employment history check, and two personal references. Companions are also trained in elder companionship, first-response basics, and medication-reminder protocols. No companion meets your family without completing this process — no exceptions.",
              },
            },
            {
              "@type": "Question",
              name: "How quickly can a visit happen?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Standard companion visits are scheduled within 24–48 hours of booking. Emergency visits are dispatched on a priority basis — typically within a few hours of your request, subject to companion availability in your loved one's city. Hospital companion visits should ideally be booked at least 24 hours in advance to allow time for companion briefing and coordination.",
              },
            },
            {
              "@type": "Question",
              name: "How do I pay?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "All payments are made securely through the Close Eye platform — by card, UPI, or net banking. Companions never handle cash, and there are no hidden fees. For monthly and quarterly plans, payment is collected upfront at the start of the billing cycle. You will receive a GST invoice for every transaction.",
              },
            },
            {
              "@type": "Question",
              name: "What about privacy?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Your family's privacy is our most important product feature. Visit reports and photos are shared only with the registered family contacts you designate — no one else. Companions sign a strict confidentiality agreement before joining the network. We never share personal data with third parties. Our full Privacy Policy is available at closeeye.online/privacy-policy.",
              },
            },
            {
              "@type": "Question",
              name: "What if my parent refuses the visit?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "This is more common than you might think, and companions are trained to handle it gently. On a first visit, the companion introduces themselves as a family friend making a check-in — not as a carer or monitor. If your loved one is still uncomfortable, we will reschedule and speak with you about the best approach. We never force entry or create distress.",
              },
            },
            {
              "@type": "Question",
              name: "Can I speak to the companion before the visit?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. On monthly and quarterly plans, you are introduced to your dedicated companion via a brief WhatsApp call before their first visit. For one-time visits, you can request this introduction and we will arrange it. We want you to feel confident before anyone meets your family.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: FAQPage,
});

const faqs: [string, string][] = [
  [
    "What is a Close Eye visit?",
    "A Close Eye visit is a friendly, in-person home call by a verified local companion. They spend 60–90 minutes with your loved one — sharing tea, checking on their mood and health, doing a basic home-safety walk-through, and making sure medications are in order. Within an hour of the visit, you receive a detailed report with time-stamped photos on your dashboard and WhatsApp. It is not a medical service — it is a warm human presence, with professional accountability built in.",
  ],
  [
    "Where in India do you operate?",
    "We are currently serving families in Hyderabad and are actively expanding to Bengaluru, Chennai, Mumbai, Delhi, Pune, and other major cities. If your loved one is in a city not yet listed, join the waitlist — we prioritise new cities based on demand and will notify you the moment we're operational near them.",
  ],
  [
    "Are companions verified?",
    "Yes — every companion goes through a 5-layer verification process before their first visit. This includes a police clearance certificate, government-issued identity verification, permanent address confirmation, employment history check, and two personal references. Companions are also trained in elder companionship, first-response basics, and medication-reminder protocols. No companion meets your family without completing this process — no exceptions.",
  ],
  [
    "How quickly can a visit happen?",
    "Standard companion visits are scheduled within 24–48 hours of booking. Emergency visits are dispatched on a priority basis — typically within a few hours of your request, subject to companion availability in your loved one's city. Hospital companion visits should ideally be booked at least 24 hours in advance to allow time for companion briefing and coordination.",
  ],
  [
    "How do I pay?",
    "All payments are made securely through the Close Eye platform — by card, UPI, or net banking. Companions never handle cash, and there are no hidden fees. For monthly and quarterly plans, payment is collected upfront at the start of the billing cycle. You will receive a GST invoice for every transaction.",
  ],
  [
    "What about privacy?",
    "Your family's privacy is our most important product feature. Visit reports and photos are shared only with the registered family contacts you designate — no one else. Companions sign a strict confidentiality agreement before joining the network. We never share personal data with third parties. Our full Privacy Policy is available at closeeye.online/privacy-policy.",
  ],
  [
    "What if my parent refuses the visit?",
    "This is more common than you might think, and companions are trained to handle it gently. On a first visit, the companion introduces themselves as a family friend making a check-in — not as a carer or monitor. If your loved one is still uncomfortable, we will reschedule and speak with you about the best approach. We never force entry or create distress.",
  ],
  [
    "Can I speak to the companion before the visit?",
    "Yes. On monthly and quarterly plans, you are introduced to your dedicated companion via a brief WhatsApp call before their first visit. For one-time visits, you can request this introduction and we will arrange it. We want you to feel confident before anyone meets your family.",
  ],
];

function FAQPage() {
  return (
    <PageShell
      eyebrow="FAQ"
      title="Questions families ask before they trust us."
    >
      <Accordion type="single" collapsible className="w-full">
        {faqs.map(([q, a], i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left font-serif text-lg text-primary">{q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageShell>
  );
}
