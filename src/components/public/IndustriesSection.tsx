import type { Industry } from "@/types";

export default function IndustriesSection({ industries }: { industries: Industry[] }) {
  if (industries.length === 0) return null;
  return (
    <section className="section-sm" style={{ background: "var(--bg-base)" }} aria-labelledby="industries-heading">
      <div className="container">
        <span className="section-label">Expertise</span>
        <h2 id="industries-heading" className="section-heading">Industries I Work With</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)", marginTop: "var(--space-lg)" }}>
          {industries.map((ind) => (
            <div key={ind.id} style={{
              display: "flex", alignItems: "center", gap: "var(--space-sm)",
              background: "var(--bg-surface)", border: "1px solid var(--bg-border)",
              borderRadius: "var(--radius-full)", padding: "8px 20px",
              fontSize: "var(--text-sm)", color: "var(--text-secondary)",
              fontFamily: "Space Grotesk", fontWeight: 500,
            }}>
              {ind.icon && <span aria-hidden="true">{ind.icon}</span>}
              {ind.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
