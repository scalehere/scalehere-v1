import type { Metadata } from "next";
import { Montserrat, Karla } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ContactDialogProvider } from "@/lib/contact-dialog-context";
import { Analytics } from '@vercel/analytics/next';
import { UTMCaptureClient } from "@/components/utm-capture-client";
import { CookieNotice } from "@/components/blocks/cookie-notice";

// Heading font — Montserrat. Weights used: 500 (subheads/eyebrows/nav),
// 700 (default section titles), 900 (hero / big statement moments only)
const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
});

// Body font — Karla. Weights used: 400 (body, 80% of text),
// 700 (inline emphasis, stat callouts, labels). Italic enabled for
// pull quotes, captions, and testimonial client names.
const karla = Karla({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const SITE_URL = "https://scalehere.com";
const SITE_TITLE = "Scale SD — Social Media Marketing Agency | San Diego";
const SITE_DESCRIPTION =
  "We manage all your content & ads with just 1 hour of your time each week. 100+ clients, $1M+ revenue generated. Based in San Diego.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Scale SD",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/about_section.png",
        width: 1535,
        height: 821,
        alt: "Scale SD — Our Mission",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/about_section.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // "dark" class forces dark theme globally — our brand is dark by default
    <html
      lang="en"
      className={`${montserrat.variable} ${karla.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ContactDialogProvider>{children}</ContactDialogProvider>
        <CookieNotice />
        <Analytics />
        <UTMCaptureClient />
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wloqiibscq");
          `}
        </Script>
        <Script
          src="https://link.msgsndr.com/js/external-tracking.js"
          data-tracking-id="tk_fceb694080464e08a70b5cf2c1634200"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
