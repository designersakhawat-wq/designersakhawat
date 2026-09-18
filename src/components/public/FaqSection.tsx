"use client";

import { useState } from "react";

export default function FaqSection() {
  const faqs = [
    {
      q: "What design software and tools do you use?",
      a: "I work primarily with industry-standard Adobe Creative Cloud suite (Photoshop, Illustrator, InDesign, Premiere Pro, After Effects), Figma for digital UI/collaboration, and modern generative AI tools like Midjourney for cutting-edge concept art and motion visuals.",
    },
    {
      q: "What file formats will I receive upon project completion?",
      a: "You will receive full source files and print/web ready exports: Adobe Illustrator (.AI), Photoshop (.PSD), Vector formats (.EPS, .SVG, .PDF), and high-resolution web formats (.PNG with transparency, .JPG, .WebP). All assets come with 100% commercial usage rights.",
    },
    {
      q: "How many revisions are included?",
      a: "Depending on your selected service package, typically 3 to unlimited revisions are provided. My primary goal is ensuring you are completely thrilled with the final result before signing off.",
    },
    {
      q: "What is your standard turnaround time?",
      a: "Logo & branding projects generally take 3–5 business days for initial concepts. Social media creatives take 1–3 days, and packaging designs take 4–7 days depending on dieline complexity. Expedited delivery is available upon request.",
    },
    {
      q: "How do we get started on a project?",
      a: "You can click the 'Chat on WhatsApp' button, email me directly, or submit the contact form. We'll discuss your brief, timeline, and deliverables, and I'll send an itemized proposal with clear next steps.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="section" style={{ background: "var(--bg-base)" }} aria-labelledby="faq-heading">
      <div className="container" style={{ maxWidth: 840 }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
          <span className="section-label" style={{ justifyContent: "center" }}>FAQ</span>
          <h2 id="faq-heading" className="section-heading">Frequently Asked Questions</h2>
          <p className="section-subtext" style={{ margin: "0 auto" }}>
            Got questions? Here are quick answers to common queries from clients before starting a project.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: "var(--bg-surface)",
                  border: `1px solid ${isOpen ? "var(--accent-border)" : "var(--bg-border)"}`,
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  transition: "border-color 0.2s ease",
                }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  style={{
                    width: "100%",
                    padding: "18px 24px",
                    background: "none",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: "var(--font-heading)",
                    fontSize: "var(--text-base)",
                    fontWeight: 600,
                    color: isOpen ? "var(--accent)" : "var(--text-primary)",
                  }}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: 20, transform: isOpen ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                    +
                  </span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: "0 24px 20px",
                      fontSize: "var(--text-sm)",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
