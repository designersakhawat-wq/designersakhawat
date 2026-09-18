"use client";

import Image from "next/image";
import Link from "next/link";


interface FooterProps {
  settings: Record<string, string>;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const services = [
    { label: "Logo & Branding", href: "/services/logo-branding" },
    { label: "Social Media Design", href: "/services/social-media-design" },
    { label: "Packaging & Label Design", href: "/services/packaging-label-design" },
    { label: "AI Video Editing", href: "/services/ai-video-editing" },
  ];

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Contact", href: "/contact" },
  ];

  const socials = [
    { icon: "f", label: "Facebook", href: settings.social_facebook },
    { icon: "in", label: "LinkedIn", href: settings.social_linkedin },
    { icon: "Be", label: "Behance", href: settings.social_behance },
    { icon: "▶", label: "YouTube", href: settings.social_youtube },
  ].filter((s) => s.href);

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand column */}
          <div>
            <Link href="/" aria-label="Md Sakhawat Hossain — Home">
              <Image
                src="/images/logo-horizontal.png"
                alt="Md Sakhawat Hossain"
                width={180}
                height={45}
                style={{ height: 40, width: "auto", marginBottom: "var(--space-md)" }}
              />
            </Link>
            <div className="footer-brand-name">{settings.site_name || "Md Sakhawat Hossain"}</div>
            <p className="footer-brand-tagline">{settings.site_tagline || "Creative Graphic Designer"}</p>

            {/* Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
              <a
                href={settings.contact_whatsapp_url || "https://wa.me/8801781955355"}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", display: "flex", alignItems: "center", gap: 8, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                📱 {settings.contact_whatsapp || "+8801781955355"}
              </a>
              <a
                href={`mailto:${settings.contact_email || "designersakhawat86@gmail.com"}`}
                style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", display: "flex", alignItems: "center", gap: 8, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                ✉️ {settings.contact_email || "designersakhawat86@gmail.com"}
              </a>
            </div>

            {/* Social icons */}
            {socials.length > 0 && (
              <div className="footer-social">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link"
                    aria-label={s.label}
                  >
                    <span style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>{s.icon}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Services */}
          <div>
            <div className="footer-nav-title">Services</div>
            <nav className="footer-nav-links" aria-label="Services navigation">
              {services.map((s) => (
                <Link key={s.href} href={s.href} className="footer-nav-link">
                  {s.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Quick links */}
          <div>
            <div className="footer-nav-title">Quick Links</div>
            <nav className="footer-nav-links" aria-label="Quick navigation">
              {quickLinks.map((l) => (
                <Link key={l.href} href={l.href} className="footer-nav-link">
                  {l.label}
                </Link>
              ))}
              <a
                href="https://wa.me/8801781955355?text=Hi%20Sakhawat%2C%20I%27d%20like%20to%20start%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="footer-nav-link"
              >
                Start a Project →
              </a>
            </nav>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} {settings.site_name || "Md Sakhawat Hossain"}. All rights reserved.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>
            Creative Graphic Designer
          </p>
        </div>
      </div>
    </footer>
  );
}
