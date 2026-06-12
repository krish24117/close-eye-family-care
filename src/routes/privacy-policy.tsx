import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/marketing/PageShell";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Close Eye" },
      { name: "description", content: "How Close Eye collects, uses and protects your personal data when you use our wellbeing visit services for elderly care in India." },
      { property: "og:title", content: "Privacy Policy — Close Eye" },
      { property: "og:description", content: "Close Eye privacy policy and data handling practices." },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro="We take your trust seriously. This policy explains how we collect, use and protect your personal information and the data gathered during wellbeing visits."
    >
      <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed space-y-10">

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">1. Who we are</h2>
          <p>Close Eye ("we", "us" or "our") operates the platform at closeeye.online and provides verified wellbeing visits and companion services for elderly individuals in India. Our registered office is in India.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">2. What data we collect</h2>
          <p className="mb-2">We collect the following categories of information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Account information:</strong> Name, email address, phone number and billing address when you register or book a service.</li>
            <li><strong>Family & loved-one details:</strong> Name, age, address, medical conditions, mobility needs, emergency contacts and any special instructions you provide to help companions deliver personalised care.</li>
            <li><strong>Visit data:</strong> Photos, videos, notes and wellbeing summaries created by companions during scheduled visits. This data is uploaded to your secure dashboard.</li>
            <li><strong>Communications:</strong> Messages exchanged through our platform, WhatsApp communications and support tickets.</li>
            <li><strong>Device & usage data:</strong> IP address, browser type, device information and pages visited, collected via cookies and analytics tools.</li>
            <li><strong>Payment data:</strong> Transaction details are processed by our PCI-DSS-compliant payment partners. We do not store full card numbers.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">3. How we use your data</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To match your loved one with a suitable, verified companion.</li>
            <li>To schedule, dispatch and confirm wellbeing visits.</li>
            <li>To share visit reports, photos and notifications with authorised family members.</li>
            <li>To process payments and issue invoices.</li>
            <li>To improve our services, train companions and maintain quality standards.</li>
            <li>To comply with legal obligations and protect the safety of our users and companions.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">4. How we share data</h2>
          <p className="mb-2">We do not sell your personal data. We share data only in these limited circumstances:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Companions:</strong> Only the information necessary to conduct a safe and effective visit (name, address, medical notes, emergency contacts).</li>
            <li><strong>Family members:</strong> Visit reports and photos are visible to family members you explicitly add to your account.</li>
            <li><strong>Service providers:</strong> Trusted vendors who assist with hosting, analytics, payment processing and customer support, bound by strict confidentiality obligations.</li>
            <li><strong>Legal requirements:</strong> When required by law, court order or to protect the vital interests of your loved one or our staff.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">5. Data security</h2>
          <p>We implement appropriate technical and organisational measures to protect your data, including encryption in transit and at rest, access controls, regular security audits and background-checked staff. Despite our efforts, no internet transmission is completely secure, and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">6. Data retention</h2>
          <p>We retain personal data for as long as your account is active or as needed to provide services. Visit photos and notes are retained for 24 months after the last visit unless you request earlier deletion. Backup copies may persist for a limited period in encrypted storage. Aggregated, anonymised data may be kept indefinitely for analytics.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">7. Your rights</h2>
          <p className="mb-2">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate or incomplete data.</li>
            <li>Request deletion of your data, subject to legal and contractual obligations.</li>
            <li>Withdraw consent for marketing communications at any time.</li>
            <li>Request a copy of your data in a portable format.</li>
          </ul>
          <p className="mt-2">To exercise these rights, contact us at support@closeeye.online.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">8. Cookies and tracking</h2>
          <p>We use cookies and similar technologies to operate the platform, remember your preferences and understand how visitors use our site. You can control cookies through your browser settings. Disabling cookies may affect site functionality.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">9. Children's privacy</h2>
          <p>Our services are not directed at children under 13. If you believe we have inadvertently collected data from a child under 13, please contact us immediately and we will delete the information.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">10. International data transfers</h2>
          <p>Close Eye is based in India. If you access our services from outside India, your data will be transferred to, stored and processed in India. By using our services, you consent to this transfer.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">11. Changes to this policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes via email or a prominent notice on the platform. Continued use after changes constitutes acceptance.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-primary mb-3">12. Contact us</h2>
          <p>For questions about this Privacy Policy or our data practices, please email us at <a href="mailto:support@closeeye.online" className="text-brand hover:underline">support@closeeye.online</a> or WhatsApp <a href="https://wa.me/919000221261" className="text-brand hover:underline" target="_blank" rel="noopener noreferrer">+91 90002 21261</a>.</p>
          <p className="mt-2 text-sm">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </section>

      </div>
    </PageShell>
  );
}
