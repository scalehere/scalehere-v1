import type { Metadata } from "next";
import Link from "next/link";
import { PIXEL_LIVE } from "@/lib/feature-flags";

export const metadata: Metadata = {
  title: "Privacy Policy — Scale SD",
  description:
    "How Scale SD collects, uses, and protects your information when you visit scalehere.com.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "May 9, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl">
        {/* Minimal header — exit link + brand anchor (mirrors /calendar) */}
        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            ← Back to Scale SD
          </Link>
          <Link
            href="/"
            aria-label="home"
            className="relative inline-flex items-center"
          >
            <img
              src="/scalehere_logos/basic_logo.webp"
              alt=""
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-auto opacity-25 pointer-events-none select-none"
            />
            <span className="relative z-10 font-heading text-2xl font-black tracking-widest text-white">
              SCALE SD
            </span>
          </Link>
        </div>

        <h1 className="font-heading text-4xl font-bold leading-tight text-white md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Effective: {LAST_UPDATED} · Last updated: {LAST_UPDATED}
        </p>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-white/80">
          <p>
            Scale SD LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates this
            website at scalehere.com (the &ldquo;Site&rdquo;). This Privacy Policy explains what
            information we collect when you visit, how we use it, and the choices you have.
          </p>
          <p>
            We do not collect sensitive personal information such as health, financial,
            biometric, or government ID data.
          </p>
          <p>
            We display a notice on first visit informing you of our use of cookies and
            tracking technologies.
          </p>
          <p>
            If you have any questions, contact us at{" "}
            <a
              href="mailto:media@scalehere.com"
              className="text-primary underline underline-offset-2 hover:text-white"
            >
              media@scalehere.com
            </a>
            .
          </p>
        </div>

        {/* What we collect */}
        <Section title="What we collect">
          <SubSection title="Site usage analytics">
            <p>
              We use <strong>Vercel Web Analytics</strong> to understand traffic patterns on
              the Site — page views, web vitals (load speed, interaction latency), and
              approximate location derived from your IP address. Vercel Analytics does not
              set cookies on your device and does not track you across other sites. Data is
              retained for one month.
            </p>
          </SubSection>

          <SubSection title="Heatmaps and session recordings">
            <p>
              We use <strong>Microsoft Clarity</strong> to see how visitors interact with the
              Site — mouse movements, clicks, scrolls, and viewport changes — so we can
              identify and fix usability problems. Clarity sets cookies and records
              anonymized sessions; form input fields are masked by default and not visible
              in recordings. Microsoft retains Clarity data for 13 months.
            </p>
          </SubSection>

          {PIXEL_LIVE && (
            <SubSection title="Advertising tracking">
              <p>
                We use <strong>Meta Pixel</strong> to measure the performance of our ads on
                Meta platforms (Facebook, Instagram). The Pixel sends data about your visit
                — including page views, actions you take, and your IP address — to Meta, who
                may use it to attribute ad clicks and serve targeted advertising. The Pixel
                sets cookies and may operate even if you do not have a Meta account.
              </p>
            </SubSection>
          )}

          <SubSection title="Contact form submissions">
            <p>
              When you submit our contact form, we collect your name, email address,
              optional phone number, message, and any UTM parameters in the URL that
              brought you to the Site. This information is sent to <strong>Go High Level
              (GHL)</strong>, our customer relationship management system, and to{" "}
              <strong>Resend</strong> as a backup email path if GHL is unreachable. We use
              this information to respond to your inquiry and follow up about our services.
              If you provide a phone number, we may contact you by SMS or phone to follow
              up on your inquiry. Standard message and data rates may apply. Reply{" "}
              <strong>STOP</strong> to opt out of SMS messages at any time.
            </p>
          </SubSection>
        </Section>

        {/* How we use */}
        <Section title="How we use your information">
          <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-white/80">
            <li>To respond to inquiries and provide services you request</li>
            <li>To understand how visitors use the Site and improve it</li>
            <li>To measure marketing campaign performance</li>
            {PIXEL_LIVE && (
              <li>
                To serve relevant ads on Meta platforms based on your interaction with the
                Site
              </li>
            )}
            <li>To comply with legal obligations</li>
          </ul>
          <p className="mt-4 text-base leading-relaxed text-white/80">
            We do not sell your personal information to third parties.
          </p>
        </Section>

        {/* Third parties */}
        <Section title="Third parties who process your data">
          <p>
            The third-party services below receive limited information to perform the
            functions described above. Each operates under its own privacy policy.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/15 text-left text-xs uppercase tracking-wider text-white/60">
                  <th className="py-3 pr-4 font-medium">Service</th>
                  <th className="py-3 pr-4 font-medium">Purpose</th>
                  <th className="py-3 font-medium">Storage location</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                <tr className="border-b border-white/10">
                  <td className="py-3 pr-4 font-medium">Vercel</td>
                  <td className="py-3 pr-4">Site hosting + analytics</td>
                  <td className="py-3">United States</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 pr-4 font-medium">Microsoft Clarity</td>
                  <td className="py-3 pr-4">Heatmaps + session recordings</td>
                  <td className="py-3">United States</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 pr-4 font-medium">Go High Level</td>
                  <td className="py-3 pr-4">CRM for form submissions</td>
                  <td className="py-3">United States</td>
                </tr>
                <tr className={PIXEL_LIVE ? "border-b border-white/10" : ""}>
                  <td className="py-3 pr-4 font-medium">Resend</td>
                  <td className="py-3 pr-4">Fallback email delivery</td>
                  <td className="py-3">United States</td>
                </tr>
                {PIXEL_LIVE && (
                  <tr>
                    <td className="py-3 pr-4 font-medium">Meta</td>
                    <td className="py-3 pr-4">Ad performance tracking</td>
                    <td className="py-3">Global</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Retention */}
        <Section title="Data retention">
          <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-white/80">
            <li>Vercel Analytics: 1 month</li>
            <li>Microsoft Clarity: 13 months (Microsoft default)</li>
            <li>
              Contact form submissions: kept in our CRM until you request deletion or your
              relationship with us has ended
            </li>
            <li>Email delivery logs: 90 days (Resend default)</li>
            {PIXEL_LIVE && (
              <li>Meta Pixel data: governed by Meta&apos;s data retention policies</li>
            )}
          </ul>
        </Section>

        {/* Choices and rights */}
        <Section title="Your choices and rights">
          <SubSection title="Disable analytics">
            <p>
              You can opt out of Microsoft Clarity by visiting{" "}
              <a
                href="https://choice.microsoft.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:text-white"
              >
                Microsoft&apos;s opt-out page
              </a>
              . Most browsers also let you disable cookies entirely or send a Do Not Track
              signal.
            </p>
          </SubSection>

          {PIXEL_LIVE && (
            <SubSection title="Disable Meta tracking">
              <p>
                You can opt out of Meta&apos;s behavioral advertising via your{" "}
                <a
                  href="https://accounts.meta.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:text-white"
                >
                  Meta account settings
                </a>{" "}
                or browser-level controls.
              </p>
            </SubSection>
          )}

          <SubSection title="Access, correction, deletion">
            <p>
              Email us at{" "}
              <a
                href="mailto:media@scalehere.com"
                className="text-primary underline underline-offset-2 hover:text-white"
              >
                media@scalehere.com
              </a>{" "}
              and we will respond within 30 days. To verify your identity before making
              changes, we will usually reply from the email address associated with your
              contact submission.
            </p>
          </SubSection>

          <SubSection title="California residents">
            <p>
              If you are a California resident, the California Consumer Privacy Act (CCPA)
              may give you additional rights, including the right to know what we have
              collected, request deletion, and opt out of the &ldquo;sale&rdquo; or
              &ldquo;sharing&rdquo; of your personal information. We do not engage in
              either. To exercise these rights, contact us at the email above.
            </p>
          </SubSection>
        </Section>

        {/* COPPA */}
        <Section title="Children's privacy">
          <p>
            This Site is not directed to children under 13. We do not knowingly collect
            personal information from children under 13. If you believe a child has
            submitted information through the Site, contact us and we will delete it.
          </p>
        </Section>

        {/* Changes */}
        <Section title="Changes to this policy">
          <p>
            We may update this Privacy Policy from time to time. When we do, we will update
            the &ldquo;Last updated&rdquo; date at the top. For material changes, we will also
            provide notice on the Site.
          </p>
        </Section>

        {/* Contact */}
        <Section title="Contact">
          <address className="not-italic">
            <p className="font-medium text-white">Scale SD LLC</p>
            <p className="mt-1">
              Email:{" "}
              <a
                href="mailto:media@scalehere.com"
                className="text-primary underline underline-offset-2 hover:text-white"
              >
                media@scalehere.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a
                href="tel:7604437876"
                className="text-primary underline underline-offset-2 hover:text-white"
              >
                760-443-7876
              </a>
            </p>
            <p>345 E Park Ave Apt 15</p>
            <p>Escondido, CA 92025</p>
          </address>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="font-heading text-lg font-medium text-white md:text-xl">{title}</h3>
      <div className="mt-2 space-y-3 text-base leading-relaxed text-white/80">{children}</div>
    </div>
  );
}
