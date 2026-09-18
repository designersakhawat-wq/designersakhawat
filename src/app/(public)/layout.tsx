import type { Metadata } from "next";
import ScrollAnimationProvider from "@/components/public/ScrollAnimationProvider";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollAnimationProvider>
      <div className="page-soft-entrance">{children}</div>
    </ScrollAnimationProvider>
  );
}
