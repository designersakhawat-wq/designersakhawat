import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

// Public layout — nothing extra needed; Navbar/Footer are included per-page.
// This file exists to satisfy Next.js App Router route group requirements.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
