"use client";

import { useState, useEffect } from "react";

const TABS = [
  { id: "hero", label: "Hero & Home" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact & Social" },
  { id: "seo", label: "SEO & Meta" },
];

const DEFAULT_SETTINGS: Record<string, string> = {
  site_name: "Md Sakhawat Hossain",
  site_tagline: "Creative Graphic Designer",
  hero_headline: "Crafting Brands That Leave a Mark",
  hero_subline: "Creative graphic design — logo, branding, social media, packaging, and AI video editing.",
  hero_cta_primary_label: "View My Work",
  hero_cta_primary_href: "/portfolio",
  hero_cta_secondary_label: "Let's Talk",
  hero_cta_secondary_href: "https://wa.me/8801781955355",
  about_bio: "I'm Md Sakhawat Hossain, a creative graphic designer with a passion for building brands that resonate.\n\nWith expertise in logo design, branding, social media graphics, packaging, and AI video editing, I help businesses tell their story visually.",
  contact_whatsapp: "+8801781955355",
  contact_whatsapp_url: "https://wa.me/8801781955355",
  contact_email: "designersakhawat86@gmail.com",
  contact_location: "Bangladesh",
  social_facebook: "",
  social_instagram: "",
  social_linkedin: "",
  social_behance: "",
  social_youtube: "",
  seo_title_template: "%s | Md Sakhawat Hossain",
  seo_default_description: "Creative graphic designer specializing in logo & branding, social media design, packaging & label design, and AI video editing.",
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function update(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSettings((prev) => ({ ...prev, [key]: e.target.value }));
    };
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (data.success) {
        setToast({ type: "success", msg: "Settings saved successfully!" });
      } else {
        setToast({ type: "error", msg: data.error || "Save failed." });
      }
    } catch {
      setToast({ type: "error", msg: "Network error." });
    }
    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  }

  if (loading) {
    return <div style={{ padding: "var(--space-xl)", color: "var(--text-muted)" }}>Loading settings...</div>;
  }

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: "var(--space-xs)", marginBottom: "var(--space-xl)", borderBottom: "1px solid var(--bg-border)", paddingBottom: 0 }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px var(--space-md)",
              background: "none", border: "none",
              borderBottom: activeTab === tab.id ? "2px solid var(--accent)" : "2px solid transparent",
              color: activeTab === tab.id ? "var(--accent)" : "var(--text-secondary)",
              fontFamily: "Space Grotesk", fontWeight: 600, fontSize: "var(--text-sm)",
              cursor: "pointer", marginBottom: "-1px", transition: "color 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 720 }}>
        {activeTab === "hero" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <Field label="Site Name" id="site_name" value={settings.site_name} onChange={update("site_name")} />
            <Field label="Professional Title / Tagline" id="site_tagline" value={settings.site_tagline} onChange={update("site_tagline")} />
            <Field label="Hero Headline" id="hero_headline" value={settings.hero_headline} onChange={update("hero_headline")} hint='Use "Mark" to highlight a word in accent color' />
            <Field label="Hero Subline" id="hero_subline" value={settings.hero_subline} onChange={update("hero_subline")} textarea />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
              <Field label="Primary CTA Label" id="hero_cta_primary_label" value={settings.hero_cta_primary_label} onChange={update("hero_cta_primary_label")} />
              <Field label="Primary CTA Link" id="hero_cta_primary_href" value={settings.hero_cta_primary_href} onChange={update("hero_cta_primary_href")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
              <Field label="Secondary CTA Label" id="hero_cta_secondary_label" value={settings.hero_cta_secondary_label} onChange={update("hero_cta_secondary_label")} />
              <Field label="Secondary CTA Link" id="hero_cta_secondary_href" value={settings.hero_cta_secondary_href} onChange={update("hero_cta_secondary_href")} />
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <Field label="About Bio" id="about_bio" value={settings.about_bio} onChange={update("about_bio")} textarea rows={8} hint="Use blank lines to separate paragraphs." />
          </div>
        )}

        {activeTab === "contact" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
              <Field label="WhatsApp Number" id="contact_whatsapp" value={settings.contact_whatsapp} onChange={update("contact_whatsapp")} placeholder="+8801781955355" />
              <Field label="WhatsApp URL" id="contact_whatsapp_url" value={settings.contact_whatsapp_url} onChange={update("contact_whatsapp_url")} placeholder="https://wa.me/8801781955355" />
            </div>
            <Field label="Email Address" id="contact_email" value={settings.contact_email} onChange={update("contact_email")} type="email" />
            <Field label="Location" id="contact_location" value={settings.contact_location} onChange={update("contact_location")} placeholder="Bangladesh" />
            <div style={{ marginTop: "var(--space-md)" }}>
              <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-md)" }}>Social Media Links (leave blank to hide)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                <Field label="Facebook" id="social_facebook" value={settings.social_facebook} onChange={update("social_facebook")} placeholder="https://facebook.com/..." />
                <Field label="Instagram" id="social_instagram" value={settings.social_instagram} onChange={update("social_instagram")} placeholder="https://instagram.com/..." />
                <Field label="LinkedIn" id="social_linkedin" value={settings.social_linkedin} onChange={update("social_linkedin")} placeholder="https://linkedin.com/in/..." />
                <Field label="Behance" id="social_behance" value={settings.social_behance} onChange={update("social_behance")} placeholder="https://behance.net/..." />
                <Field label="YouTube" id="social_youtube" value={settings.social_youtube} onChange={update("social_youtube")} placeholder="https://youtube.com/..." />
              </div>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <Field label="Page Title Template" id="seo_title_template" value={settings.seo_title_template} onChange={update("seo_title_template")} hint='Use %s as placeholder for page title. E.g. "%s | Md Sakhawat Hossain"' />
            <Field label="Default Meta Description" id="seo_default_description" value={settings.seo_default_description} onChange={update("seo_default_description")} textarea hint="Used when a page doesn't have its own description. 150-160 characters recommended." />
          </div>
        )}

        {/* Save button */}
        <div style={{ marginTop: "var(--space-xl)", display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
          <button onClick={save} disabled={saving} className="btn btn-primary">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {toast && (
            <span style={{ color: toast.type === "success" ? "var(--success)" : "var(--danger)", fontSize: "var(--text-sm)" }}>
              {toast.type === "success" ? "✓" : "✗"} {toast.msg}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Field helper ────────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  textarea?: boolean;
  rows?: number;
  hint?: string;
  placeholder?: string;
  type?: string;
}

function Field({ label, id, value, onChange, textarea, rows = 4, hint, placeholder, type = "text" }: FieldProps) {
  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label" htmlFor={id}>{label}</label>
      {textarea ? (
        <textarea id={id} className="form-textarea" value={value} onChange={onChange} rows={rows} placeholder={placeholder} />
      ) : (
        <input id={id} type={type} className="form-input" value={value} onChange={onChange} placeholder={placeholder} />
      )}
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  );
}
