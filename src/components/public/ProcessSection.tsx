export default function ProcessSection() {
  const steps = [
    {
      num: "01",
      title: "Discovery & Strategy",
      desc: "Deep dive into your brand core, target demographic, market competitors, and aesthetic preferences to establish a clear visual roadmap.",
    },
    {
      num: "02",
      title: "Concept & Exploration",
      desc: "Developing initial design drafts, typography directions, color schemes, and 3D mockups crafted specifically for your industry.",
    },
    {
      num: "03",
      title: "Refinement & Polish",
      desc: "Collaborative review rounds to dial in every curve, font kerning, contrast ratio, and layout detail until it surpasses your standards.",
    },
    {
      num: "04",
      title: "Final Delivery & Support",
      desc: "Handing over all production-ready files (AI, PSD, SVG, EPS, PDF, WebP) with full commercial ownership and brand guideline documentation.",
    },
  ];

  return (
    <section className="section" style={{ background: "var(--bg-deep)" }} aria-labelledby="process-heading">
      <div className="container">
        <div style={{ maxWidth: 640, marginBottom: "var(--space-2xl)" }}>
          <span className="section-label">Workflow</span>
          <h2 id="process-heading" className="section-heading">How We Bring Your Vision To Life</h2>
          <p className="section-subtext">
            A structured, transparent creative process designed to deliver exceptional results with zero friction.
          </p>
        </div>

        <div className="grid-4" style={{ gap: "var(--space-lg)" }}>
          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-xl) var(--space-lg)",
                position: "relative",
                transition: "all 0.25s ease",
              }}
              className="process-card"
            >
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "var(--text-3xl)",
                  fontWeight: 800,
                  color: "var(--accent)",
                  marginBottom: "var(--space-md)",
                  opacity: 0.9,
                }}
              >
                {step.num}
              </div>
              <h3
                style={{
                  fontSize: "var(--text-lg)",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "var(--space-sm)",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
