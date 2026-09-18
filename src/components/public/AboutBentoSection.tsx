import Image from "next/image";

interface AboutBentoSectionProps {
  settings: Record<string, string>;
}

export default function AboutBentoSection({ settings }: AboutBentoSectionProps) {
  const tools = [
    { name: "Photoshop", icon: "Ps" },
    { name: "Illustrator", icon: "Ai" },
    { name: "InDesign", icon: "Id" },
    { name: "Premiere Pro", icon: "Pr" },
    { name: "After Effects", icon: "Ae" },
    { name: "Figma", icon: "Fg" },
    { name: "Midjourney", icon: "Mj" },
  ];

  const stats = [
    { value: "590+", label: "Delivered Projects" },
    { value: "37+", label: "Global Clients" },
    { value: "3+", label: "Years Experience" },
    { value: "99%", label: "5-Star Rating" },
  ];

  return (
    <section className="section" style={{ background: "var(--bg-base)" }} aria-labelledby="about-bento-heading">
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <span className="section-label">Profile & Expertise</span>
          <h2 id="about-bento-heading" className="section-heading" style={{ marginBottom: 8 }}>
            The Designer Behind the Work
          </h2>
          <p className="section-subtext">
            Blending strategic branding, bespoke packaging, and modern motion to build iconic visual identities.
          </p>
        </div>

        {/* Reference 2: Modern Bento Grid */}
        <div className="bento-grid">
          {/* Tile 1 (Large Left): Portrait + Identity + Socials */}
          <div
            className="bento-card"
            style={{
              gridRow: "span 2",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 0,
              background: "linear-gradient(180deg, rgba(25, 27, 36, 0.4) 0%, #0d0e12 100%)",
            }}
          >
            {/* Seamless Portrait Image */}
            <div style={{ position: "relative", width: "100%", height: 320, overflow: "hidden" }}>
              <Image
                src="/images/profile-square.jpg"
                alt="Md Sakhawat Hossain"
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
                sizes="(max-width: 860px) 100vw, 50vw"
                priority
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, #0d0e12 0%, rgba(13, 14, 18, 0.2) 60%, transparent 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  background: "rgba(7, 7, 9, 0.8)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid var(--accent-border)",
                  borderRadius: "var(--radius-full)",
                  padding: "5px 12px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--accent)",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
                <span>ONLINE & AVAILABLE</span>
              </div>
            </div>

            {/* Designer Details */}
            <div style={{ padding: "24px 28px 28px" }}>
              <h3 style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "#ffffff", marginBottom: 4 }}>
                Md Sakhawat Hossain
              </h3>
              <p style={{ color: "var(--accent)", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 12 }}>
                Creative Graphic Designer & Brand Specialist
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: 1.6, marginBottom: 20 }}>
                Based in Dhaka, Bangladesh — collaborating with innovative startups, agency founders, and direct-to-consumer brands globally.
              </p>

              {/* Social links pill bar (Reference 2 style) */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a
                  href="https://wa.me/8801781955355"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--radius-full)",
                    background: "rgba(37, 211, 102, 0.12)",
                    border: "1px solid rgba(37, 211, 102, 0.3)",
                    color: "#25D366",
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  WhatsApp
                </a>
                <a
                  href="https://facebook.com/designersakhawat"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--bg-border)",
                    color: "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Facebook
                </a>
                <a
                  href="mailto:designersakhawat86@gmail.com"
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--bg-border)",
                    color: "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Email
                </a>
              </div>
            </div>
          </div>

          {/* Tile 2 (Top Right): Designer Statement & Philosophy */}
          <div className="bento-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
              Creative Statement
            </span>
            <blockquote
              style={{
                fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                fontWeight: 600,
                color: "#ffffff",
                lineHeight: 1.5,
                marginBottom: 16,
                fontFamily: "var(--font-heading)",
              }}
            >
              &ldquo;I create premium visuals that don&apos;t just look beautiful — they command attention, build instant credibility, and convert.&rdquo;
            </blockquote>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.65 }}>
              Over the past 3+ years, I have honed a workflow that balances aesthetic perfection with fast execution. Whether establishing a complete brand architecture or crafting 3D packaging mockups, my focus is delivering assets that give you an unfair advantage in the market.
            </p>
          </div>

          {/* Tile 3 (Bottom Right): Tools & Software + Stats */}
          <div className="bento-card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10, display: "block" }}>
                Tools of the Trade
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {tools.map((t) => (
                  <span
                    key={t.name}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 12px",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--bg-border)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    <span style={{ color: "var(--accent)", fontWeight: 800, fontSize: 11 }}>{t.icon}</span>
                    <span>{t.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Mini Stats 2x2 grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 12,
                borderTop: "1px solid var(--bg-border)",
                paddingTop: 16,
              }}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 800, color: "var(--accent)" }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
