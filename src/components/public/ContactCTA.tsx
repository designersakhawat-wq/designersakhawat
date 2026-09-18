interface ContactCTAProps {
  whatsappUrl: string;
  email: string;
}

export default function ContactCTA({ whatsappUrl, email }: ContactCTAProps) {
  return (
    <section
      className="section"
      style={{
        background: "linear-gradient(135deg, rgba(200,240,0,0.06) 0%, transparent 60%)",
        borderTop: "1px solid var(--bg-border)",
      }}
      aria-labelledby="cta-heading"
    >
      <div className="container" style={{ textAlign: "center" }}>
        <span className="section-label" style={{ justifyContent: "center" }}>Let&apos;s Work Together</span>
        <h2 id="cta-heading" className="section-heading" style={{ maxWidth: "12ch", margin: "0 auto var(--space-md)" }}>
          Have a Project in Mind?
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)", maxWidth: "50ch", margin: "0 auto var(--space-xl)" }}>
          Let&apos;s create something that brings your brand to life. Reach out and let&apos;s talk about your vision.
        </p>

        <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href={`${whatsappUrl}?text=${encodeURIComponent("Hi Sakhawat, I'd like to discuss a project.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg"
          >
            💬 WhatsApp Me
          </a>
          <a
            href={`mailto:${email}`}
            className="btn btn-outline btn-lg"
          >
            ✉️ Send an Email
          </a>
          <a
            href="/contact"
            className="btn btn-ghost btn-lg"
          >
            Fill a Form →
          </a>
        </div>
      </div>
    </section>
  );
}
