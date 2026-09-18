import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ContactForm from "@/components/public/ContactForm";
import { getSettings } from "@/lib/db/settings";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact | Md Sakhawat Hossain",
  description: "Get in touch with Md Sakhawat Hossain for your graphic design projects. WhatsApp, email, or fill in the contact form.",
};

export default async function ContactPage() {
  const settings = await getSettings([
    "contact_whatsapp", "contact_whatsapp_url", "contact_email",
    "contact_location", "social_facebook", "social_instagram",
    "social_linkedin", "social_behance", "social_youtube",
  ]);

  const services = [
    "Logo & Brand Identity",
    "Social Media Design",
    "Packaging & Label Design",
    "AI Video Editing",
    "Other / Not sure yet",
  ];

  return (
    <>
      <Navbar />
      <main>
        <section style={{ paddingTop: "calc(var(--nav-height) + var(--space-3xl))", paddingBottom: "var(--space-3xl)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "var(--space-3xl)", alignItems: "start" }}>
              {/* Info column */}
              <div>
                <span className="section-label">Get in Touch</span>
                <h1 style={{ marginBottom: "var(--space-md)", fontSize: "clamp(2rem, 5vw, 3rem)" }}>
                  Let&apos;s Start a Project
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)", lineHeight: 1.8, marginBottom: "var(--space-xl)", maxWidth: "45ch" }}>
                  Have a project in mind? I&apos;d love to hear about it. Fill in the form or reach out directly.
                </p>

                {/* Contact methods */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", marginBottom: "var(--space-xl)" }}>
                  <a
                    href={`https://wa.me/8801781955355?text=${encodeURIComponent("Hi Sakhawat, I'd like to discuss a project.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    <div style={{ width: 44, height: 44, background: "rgba(37,211,102,0.15)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>💬</div>
                    <div>
                      <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, marginBottom: 2 }}>WhatsApp</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
                        {settings.contact_whatsapp || "+8801781955355"}
                      </div>
                    </div>
                    <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>→</span>
                  </a>

                  <a
                    href={`mailto:${settings.contact_email || "designersakhawat86@gmail.com"}`}
                    className="contact-link"
                  >
                    <div style={{ width: 44, height: 44, background: "rgba(200,240,0,0.1)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>✉️</div>
                    <div>
                      <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, marginBottom: 2 }}>Email</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
                        {settings.contact_email || "designersakhawat86@gmail.com"}
                      </div>
                    </div>
                    <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>→</span>
                  </a>

                  {settings.contact_location && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: "var(--space-md)",
                      background: "var(--bg-surface)", border: "1px solid var(--bg-border)",
                      borderRadius: "var(--radius-lg)", padding: "var(--space-md)",
                    }}>
                      <div style={{ width: 44, height: 44, background: "rgba(59,130,246,0.1)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📍</div>
                      <div>
                        <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, marginBottom: 2 }}>Location</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>{settings.contact_location}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Response time note */}
                <div style={{
                  background: "var(--accent-glow)", border: "1px solid var(--accent-border)",
                  borderRadius: "var(--radius-md)", padding: "var(--space-md)",
                  fontSize: "var(--text-sm)", color: "var(--text-secondary)",
                }}>
                  💡 I typically respond within 24 hours. For urgent projects, WhatsApp is the fastest way to reach me.
                </div>
              </div>

              {/* Form column */}
              <div style={{
                background: "var(--bg-surface)", border: "1px solid var(--bg-border)",
                borderRadius: "var(--radius-xl)", padding: "var(--space-2xl)",
              }}>
                <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-lg)" }}>Send a Message</h2>
                <ContactForm services={services} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
