import type { Metadata, Viewport } from "next";
import { Archivo, Cormorant_Garamond } from "next/font/google";
import { SmoothScroll } from "./_components/SmoothScroll";
import { fullName, site } from "./_lib/site";
import "./globals.css";

const sans = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#fcfcf9",
};

export const metadata: Metadata = {
  title: `${fullName} — ${site.role}`,
  description: `${site.tagline}. ${site.role} by ${fullName}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
