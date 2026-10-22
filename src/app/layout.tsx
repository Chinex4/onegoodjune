import type { Metadata } from "next";
import localFont from "next/font/local";

import { site } from "@/lib/site-config";
import "./globals.css";
const songbird = localFont({
  src: "../../public/fonts/tan-songbird.otf",
  variable: "--font-songbird",
  display: "swap",
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
    <html lang="en" className={`${songbird.variable} h-full antialiased`}>
      <body>{children}</body>
    </html>
  );
}
