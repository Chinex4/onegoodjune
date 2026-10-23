import type { Metadata } from "next";
import localFont from "next/font/local";
import { Crimson_Text, Zalando_Sans } from "next/font/google";

import { site } from "@/lib/site-config";
import { MotionProvider } from "@/components/site/motion-provider";
import "./globals.css";
// Songbird's cap height is 1.44em (most faces sit near 0.7em). Halving it puts
// the display face on the same size scale and line-height as the text faces.
const songbird = localFont({
  src: "../../public/fonts/tan-songbird.otf",
  variable: "--font-songbird",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "size-adjust", value: "50%" }],
});
// Brief: paragraphs in Crimson Text (Cardo fallback); Zalando Sans is the
// brief's alternate heading face, used here for navigation, labels and controls.
const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
  display: "swap",
});
// Next.js has no fallback metrics for Zalando Sans yet, so name the fallback.
const zalando = Zalando_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-zalando",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "OneGoodJune", template: "%s | OneGoodJune" },
  description:
    "A creative studio helping faith-based African writers and creative visionaries understand, steward, and run their creative visions with intentional consistency.",
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "OneGoodJune",
    title: "We Are OneGoodJune",
    description:
      "Raising the bar in faith-based African fiction. Helping creative minds flourish.",
  },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${songbird.variable} ${crimson.variable} ${zalando.variable} h-full antialiased`}
    >
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
