"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollAnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Select all elements designated for scroll reveal
    const selector = ".reveal-on-scroll, .reveal-soft-fade, .reveal-soft-scale";
    const elements = document.querySelectorAll(selector);

    if (!("IntersectionObserver" in window)) {
      // Fallback: make everything visible immediately
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // Reveal once and keep visible for a smooth UX
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px", // Trigger slightly before it fully hits the viewport bottom
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return <>{children}</>;
}
