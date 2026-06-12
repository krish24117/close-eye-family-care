import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/marketing/PageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Close Eye" },
      { name: "description", content: "Terms and conditions governing your use of Close Eye wellbeing visit and companion services for elderly care in India." },
      { property: "og:title", content: "Terms of Service — Close Eye" },
      { property: "og:description", content: "Close Eye terms and conditions for users and families." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of Service"
      intro="Please read these terms carefully. They set out the rules for using Close Eye's wellbeing visit platform and the relationship between our company, families and companions."
    >
      <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed space-y-10">

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">1. About these terms</h2>
          <p>These Terms of Service ("Terms") govern your access to and use of the Close Eye platform, website, mobile applications and wellbeing visit services (collectively, the "Services"). By creating an account, booking a visit or otherwise using the Services, you agree to be bound by these Terms. If you do not agree, you must not use the Services.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">2. Eligibility</h2>
          <p>You must be at least 18 years old to use Close Eye. If you are using the Services on behalf of a family member or organisation, you represent that you have the authority to bind them to these Terms. You may not use the Services for any illegal or unauthorised purpose.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">3. Our services</h2>
          <p className="mb-2">Close Eye connects families with verified local companions who conduct in-person wellbeing visits for elderly individuals in India. We provide:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Companion matching based on location, language and care needs.</li>
            <li>Visit scheduling, dispatch and coordination.</li>
            <li>Photo, video and written visit reports delivered through your dashboard and WhatsApp.</li>
            <li>Emergency escalation support where available.</li>
          </ul>
          <p className="mt-2">Close Eye is a care coordination and companionship service. We do not provide medical care, nursing, or emergency medical services. Companions are not medical professionals unless explicitly stated for a specific engagement.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">4. Companion verification</h2>
          <p>We conduct ID verification, background checks and interviews for all companions before onboarding. However, we cannot guarantee the actions or behaviour of any individual companion. You acknowledge that companion visits involve allowing a third party into your loved one's home, which carries inherent risks. Please report any concerns immediately.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">5. Your responsibilities</h2>
          <p className="mb-2">As a family member or account holder, you agree to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide accurate, complete and up-to-date information about your loved one, including medical conditions, allergies, mobility limitations and emergency contacts.</li>
            <li>Ensure your loved one (or their legal guardian) has consented to visits and data collection.</li>
            <li>Maintain the security of your account credentials and promptly notify us of unauthorised access.</li>
            <li>Treat companions respectfully and not request services outside the agreed scope.</li>
            <li>Pay all applicable fees on time.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">6. Bookings, cancellations and rescheduling</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Scheduling:</strong> Visits must be booked through the platform. Walk-in or off-platform bookings are not covered by these Terms.</li>
            <li><strong>Cancellation by you:</strong> Cancellations made more than 24 hours before a scheduled visit receive a full refund. Cancellations within 24 hours may be charged in full at our discretion.</li>
            <li><strong>Cancellation by us:</strong> We may cancel or reschedule a visit due to companion unavailability, safety concerns or force majeure. In such cases you will receive a full refund or credit.</li>
            <li><strong>No-shows:</strong> If a companion arrives and cannot access the premises or the visit is refused, the visit is considered completed and no refund is due.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">7. Fees and payment</h2>
          <p>Visit fees and subscription charges are displayed at checkout and may be updated from time to time. All fees are quoted in INR unless otherwise stated. Payment is due before the visit unless you are on an approved billing plan. Late payments may result in service suspension. Refunds are processed within 7–10 business days to the original payment method.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">8. Intellectual property</h2>
          <p>All content on the Close Eye platform — including text, graphics, logos, software and visit report templates — is owned by or licensed to us and is protected by copyright and trademark laws. You may not copy, modify, distribute or create derivative works without our written permission. Visit photos and reports are shared with you for personal, non-commercial use only.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">9. Limitation of liability</h2>
          <p className="mb-2">To the maximum extent permitted by law:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Close Eye is not liable for any indirect, incidental, special or consequential damages arising from your use of the Services.</li>
            <li>Our total liability for any claim related to the Services shall not exceed the total amount you paid us in the 12 months preceding the claim.</li>
            <li>We are not responsible for the acts or omissions of companions beyond our reasonable control, nor for events caused by inaccurate information provided by you.</li>
            <li>We do not warrant that the Services will be uninterrupted, error-free or completely secure.</li>
          </ul>
          <p className="mt-2">Nothing in these Terms limits liability for fraud, gross negligence, wilful misconduct or death or personal injury caused by our negligence.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">10. Indemnity</h2>
          <p>You agree to indemnify and hold harmless Close Eye, its directors, employees and agents from any claims, damages, losses or expenses (including legal fees) arising out of your use of the Services, your breach of these Terms, or any inaccurate information you provided.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">11. Termination</h2>
          <p>You may terminate your account at any time by contacting support. We may suspend or terminate your access if you breach these Terms, engage in fraudulent activity, or if continued provision poses a safety risk. Upon termination, your right to use the Services ceases immediately. Data retention after termination is governed by our Privacy Policy.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">12. Dispute resolution and governing law</h2>
          <p>These Terms are governed by the laws of India. Any dispute arising out of or in connection with these Terms shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">13. Changes to these terms</h2>
          <p>We may modify these Terms at any time. Material changes will be notified via email or a prominent notice on the platform at least 15 days before taking effect. Continued use after changes constitutes acceptance.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">14. Contact us</h2>
          <p>For questions about these Terms, please contact us at <a href="mailto:support@closeeye.online" className="text-brand hover:underline">support@closeeye.online</a> or WhatsApp <a href="https://wa.me/919000221261" className="text-brand hover:underline" target="_blank" rel="noopener noreferrer">+91 90002 21261</a>.</p>
          <p className="mt-2 text-sm">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </section>

      </div>
    </PageShell>
  );
}
