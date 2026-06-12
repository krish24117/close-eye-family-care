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
  }),
  component: FAQPage,
});

const faqs = [
  ["What is a Close Eye visit?", "A trained, background-checked companion visits your loved one's home in India for a friendly check-in. You receive photos, notes and a wellbeing summary on your dashboard and WhatsApp."],
  ["Where in India do you operate?", "We are currently active in 12 cities including Bengaluru, Mumbai, Delhi NCR, Pune, Hyderabad, Chennai and Kolkata. Waitlist customers in other cities are matched as we expand."],
  ["Are companions verified?", "Yes. Every companion goes through ID verification, background checks, an in-person interview and ongoing training."],
  ["How quickly can a visit happen?", "Most planned visits are scheduled within 48 hours. Emergency visits are dispatched within a few hours, depending on city."],
  ["How do I pay?", "Pricing is per visit or via a monthly care plan. You'll be billed in INR or your local currency through secure international payment."],
  ["What about privacy?", "Visit photos and notes are visible only to family members you add. Companions never receive financial details."],
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
