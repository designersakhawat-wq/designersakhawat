export default function MarqueeTicker() {
  const items = [
    "BRAND IDENTITY",
    "LOGO DESIGN",
    "PACKAGING & LABELS",
    "SOCIAL MEDIA AD CREATIVES",
    "3D PRODUCT MOCKUPS",
    "AI VIDEO EDITING",
    "PRINT-READY ASSETS",
    "590+ PROJECTS DELIVERED",
    "37+ GLOBAL CLIENTS",
    "100% SATISFACTION GUARANTEED",
  ];

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--bg-border)",
        borderBottom: "1px solid var(--bg-border)",
        padding: "16px 0",
        overflow: "hidden",
        position: "relative",
        userSelect: "none",
      }}
      aria-hidden="true"
    >
      <div className="marquee-track">
        <div className="marquee-content">
          {items.map((item, idx) => (
            <span
              key={idx}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
                padding: "0 24px",
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-sm)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: idx % 2 === 0 ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              <span>{item}</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.65em" }}>✦</span>
            </span>
          ))}
        </div>
        {/* Duplicate for infinite loop */}
        <div className="marquee-content" aria-hidden="true">
          {items.map((item, idx) => (
            <span
              key={`dup-${idx}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
                padding: "0 24px",
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-sm)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: idx % 2 === 0 ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              <span>{item}</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.65em" }}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
