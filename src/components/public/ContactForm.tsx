"use client";

import { useState, FormEvent } from "react";

interface ContactFormProps {
  services: string[];
}

interface FormState {
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  honeypot: string; // spam trap
}

const budgetOptions = [
  "Under $100",
  "$100 – $300",
  "$300 – $500",
  "$500 – $1,000",
  "$1,000+",
  "Flexible / Let's discuss",
];

export default function ContactForm({ services }: ContactFormProps) {
  const [form, setForm] = useState<FormState>({
    name: "", email: "", service: "", budget: "", message: "", honeypot: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function update(key: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      if (fieldErrors[key]) {
        setFieldErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
      }
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.fields) setFieldErrors(data.fields);
        setErrorMsg(data.error || "Submission failed. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please try contacting me directly via WhatsApp.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div style={{ textAlign: "center", padding: "var(--space-2xl)" }}>
        <div style={{ fontSize: 56, marginBottom: "var(--space-md)" }}>🎉</div>
        <h3 style={{ marginBottom: "var(--space-sm)" }}>Message Sent!</h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-xl)", maxWidth: "100%" }}>
          Thank you for reaching out! I&apos;ll get back to you within 24 hours.
        </p>
        <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              setStatus("idle");
              setForm({ name: "", email: "", service: "", budget: "", message: "", honeypot: "" });
            }}
            className="btn btn-outline btn-sm"
          >
            Send Another Message
          </button>
          <a
            href="https://wa.me/8801781955355"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            WhatsApp Me
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        value={form.honeypot}
        onChange={update("honeypot")}
        tabIndex={-1}
        aria-hidden="true"
        style={{ display: "none" }}
        autoComplete="off"
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
        <div className="form-group">
          <label className="form-label required" htmlFor="contact-name">Your Name</label>
          <input
            id="contact-name"
            type="text"
            className={`form-input ${fieldErrors.name ? "error" : ""}`}
            placeholder="John Doe"
            value={form.name}
            onChange={update("name")}
            required
            disabled={status === "loading"}
            autoComplete="name"
          />
          {fieldErrors.name && <span className="form-error">{fieldErrors.name[0]}</span>}
        </div>

        <div className="form-group">
          <label className="form-label required" htmlFor="contact-email">Email Address</label>
          <input
            id="contact-email"
            type="email"
            className={`form-input ${fieldErrors.email ? "error" : ""}`}
            placeholder="you@example.com"
            value={form.email}
            onChange={update("email")}
            required
            disabled={status === "loading"}
            autoComplete="email"
          />
          {fieldErrors.email && <span className="form-error">{fieldErrors.email[0]}</span>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
        <div className="form-group">
          <label className="form-label" htmlFor="contact-service">Service Needed</label>
          <select
            id="contact-service"
            className="form-select"
            value={form.service}
            onChange={update("service")}
            disabled={status === "loading"}
          >
            <option value="">Select a service...</option>
            {services.map((svc) => (
              <option key={svc} value={svc}>{svc}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="contact-budget">Budget Range</label>
          <select
            id="contact-budget"
            className="form-select"
            value={form.budget}
            onChange={update("budget")}
            disabled={status === "loading"}
          >
            <option value="">Select a budget...</option>
            {budgetOptions.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label required" htmlFor="contact-message">Your Message</label>
        <textarea
          id="contact-message"
          className={`form-textarea ${fieldErrors.message ? "error" : ""}`}
          placeholder="Tell me about your project — what you need, your timeline, any specific ideas..."
          value={form.message}
          onChange={update("message")}
          required
          disabled={status === "loading"}
          rows={5}
        />
        {fieldErrors.message && <span className="form-error">{fieldErrors.message[0]}</span>}
        <span className="form-hint">{form.message.length} / 5000 characters</span>
      </div>

      {errorMsg && (
        <div style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "var(--radius-md)", padding: "12px var(--space-md)",
          color: "var(--danger)", fontSize: "var(--text-sm)", marginBottom: "var(--space-md)",
        }}>
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "loading"}
        style={{ width: "100%", justifyContent: "center" }}
      >
        {status === "loading" ? (
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            Sending...
          </span>
        ) : "Send Message →"}
      </button>

      <p style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)", textAlign: "center", marginTop: "var(--space-sm)" }}>
        I&apos;ll respond within 24 hours. Your info stays private.
      </p>

      <style>{`
        .form-input.error, .form-textarea.error {
          border-color: var(--danger);
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </form>
  );
}
