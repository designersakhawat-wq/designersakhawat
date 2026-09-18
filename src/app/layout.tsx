import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Space_Grotesk } from "next/font/google";
import "@/styles/globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Md Sakhawat Hossain — Creative Graphic Designer",
    template: "%s | Md Sakhawat Hossain",
  },
  description:
    "Creative graphic designer specializing in logo & branding, social media design, packaging & label design, and AI video editing.",
  keywords: [
    "graphic designer",
    "logo design",
    "branding",
    "social media design",
    "packaging design",
    "AI video editing",
    "Bangladesh",
  ],
  authors: [{ name: "Md Sakhawat Hossain" }],
  creator: "Md Sakhawat Hossain",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Md Sakhawat Hossain — Creative Graphic Designer",
    images: [
      {
        url: "/images/logo-icon.png",
        width: 1200,
        height: 630,
        alt: "Md Sakhawat Hossain — Creative Graphic Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
