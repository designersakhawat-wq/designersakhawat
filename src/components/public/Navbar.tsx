"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="floating-header" role="banner">
        <div className="container floating-nav-container">
          {/* Brand Logo */}
          <Link href="/" className="nav-logo" aria-label="Md Sakhawat Hossain — Home">
            <Image
              src="/images/logo-horizontal.png"
              alt="Md Sakhawat Hossain — Creative Graphic Designer"
              width={180}
              height={44}
              style={{ height: 40, width: "auto", objectFit: "contain" }}
              priority
            />
          </Link>

          {/* Reference 1: Floating Centered Pill Menu */}
          <nav className="floating-pill-nav desktop-only" role="navigation" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`floating-nav-link ${isActive ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Live Status */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <a
              href="https://wa.me/8801781955355?text=Hi%20Sakhawat%2C%20I%27d%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="floating-cta-btn desktop-only"
              aria-label="Start a project on WhatsApp"
            >
              <span>Let&apos;s Talk</span>
              <span style={{ fontSize: 14 }}>↗</span>
            </a>

            {/* Mobile hamburger toggle */}
            <button
              className="nav-mobile-toggle mobile-only"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
              style={{
                background: "rgba(18, 20, 26, 0.8)",
                border: "1px solid var(--bg-border)",
                color: "var(--text-primary)",
                width: 42,
                height: 42,
                borderRadius: "var(--radius-md)",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`nav-mobile-menu ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
      >
        <div style={{ position: "absolute", top: 20, left: 24 }}>
          <Image
            src="/images/logo-horizontal.png"
            alt="Logo"
            width={160}
            height={40}
            style={{ height: 36, width: "auto", objectFit: "contain" }}
          />
        </div>

        <button
          onClick={() => setMenuOpen(false)}
          style={{
            position: "absolute",
            top: 20,
            right: 24,
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            fontSize: 24,
            cursor: "pointer",
          }}
          aria-label="Close menu"
        >
          ✕
        </button>

        <nav className="nav-mobile-links" aria-label="Mobile navigation links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-mobile-link ${pathname === link.href ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: "var(--space-xl)", display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
            <a
              href="https://wa.me/8801781955355?text=Hi%20Sakhawat%2C%20I%27d%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Chat on WhatsApp ↗
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
