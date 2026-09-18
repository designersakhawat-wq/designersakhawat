"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  section?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "⊞", section: "Overview" },
  { label: "Hero & Home", href: "/admin/hero", icon: "🏠", section: "Content" },
  { label: "About & Bio", href: "/admin/about", icon: "👤", section: "Content" },
  { label: "Services", href: "/admin/services", icon: "🎨", section: "Content" },
  { label: "Projects", href: "/admin/projects", icon: "📁", section: "Content" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "💬", section: "Content" },
  { label: "Client Logos", href: "/admin/clients", icon: "🏢", section: "Content" },
  { label: "Industries", href: "/admin/industries", icon: "🌐", section: "Content" },
  { label: "Media Library", href: "/admin/media", icon: "🖼️", section: "Media" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "✉️", section: "Contacts" },
  { label: "Contact Details", href: "/admin/settings?tab=contact", icon: "📞", section: "Settings" },
  { label: "SEO & Meta", href: "/admin/settings?tab=seo", icon: "🔍", section: "Settings" },
  { label: "Site Settings", href: "/admin/settings", icon: "⚙️", section: "Settings" },
];

interface AdminShellProps {
  children: React.ReactNode;
  adminName: string;
}

export default function AdminShell({ children, adminName }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  const sections = [...new Set(navItems.map((i) => i.section))];

  const pageTitle = navItems.find((i) => pathname.startsWith(i.href.split("?")[0]))?.label || "Admin";

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <Image
            src="/images/logo-icon.png"
            alt="Logo"
            width={32}
            height={32}
            style={{ borderRadius: "50%", flexShrink: 0 }}
          />
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: "var(--text-sm)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Admin Panel
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {adminName}
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          {sections.map((section) => (
            <div key={section} className="admin-nav-section">
              <div className="admin-nav-section-label">{section}</div>
              {navItems
                .filter((i) => i.section === section)
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-link ${
                      pathname.startsWith(item.href.split("?")[0]) ? "active" : ""
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="admin-nav-link-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div style={{
          padding: "var(--space-md)",
          borderTop: "1px solid var(--bg-border)",
          display: "flex",
          gap: "var(--space-sm)",
          flexShrink: 0,
        }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
            style={{ flex: 1, justifyContent: "center" }}
          >
            View Site ↗
          </a>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="btn btn-ghost btn-sm btn-danger"
            style={{ flex: 1, justifyContent: "center" }}
          >
            {loggingOut ? "..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 49,
          }}
        />
      )}

      {/* Main content */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: "none",
                width: 36, height: 36,
                background: "var(--bg-hover)",
                border: "1px solid var(--bg-border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-secondary)",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              className="admin-mobile-toggle"
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <h1 className="admin-topbar-title">{pageTitle}</h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
            <a
              href="/"
              target="_blank"
              rel="noopener"
              className="btn btn-ghost btn-sm"
              style={{ gap: "4px" }}
            >
              View Site ↗
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
