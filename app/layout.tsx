import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import ComingSoonModal from "@/components/ComingSoonModal";
import ConditionalNavigation from "@/components/layout/ConditionalNavigation";
import { STORE_CONFIG } from "@/config/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Bloomsy - High Modern Style",
    template: "%s | Bloomsy",
  },
  description:
    "Ropa femenina chilena con actitud. Tallas S a 4XL. Envios a todo Chile.",
  keywords: ["ropa femenina", "tallas curvy", "moda Chile", "bloomsy"],
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://bloomsy.cl",
    siteName: "Bloomsy",
    title: "Bloomsy - High Modern Style",
    description:
      "Ropa femenina chilena con actitud. Tallas S a 4XL. Envios a todo Chile.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bloomsy - High Modern Style",
    description: "Ropa femenina chilena con actitud. Tallas S a 4XL.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col bg-bloomsy-cream text-bloomsy-black">
        <ConditionalNavigation
          banner={STORE_CONFIG.isComingSoon ? <ComingSoonBanner /> : null}
          nav={<Navbar />}
          footer={<Footer />}
          modal={STORE_CONFIG.isComingSoon ? <ComingSoonModal /> : null}
        >
          {children}
        </ConditionalNavigation>
      </body>
    </html>
  );
}
