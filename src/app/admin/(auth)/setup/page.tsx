"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";

export default function AdminSetupPage() {
  const [setupStatus, setSetupStatus] = useState<"checking" | "needed" | "done" | "error">("checking");
  const [form, setForm] = useState({ token: "", name: "", email: "", password: "", confirm: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/setup")
      .then((r) => r.json())
      .then((data) => {
        if (data.setupRequired === false) setSetupStatus("done");
        else setSetupStatus("needed");
      })
      .catch(() => setSetupStatus("error"));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setMessage("Passwords do not match.");
      setStatus("error");
      return;
    }
    if (form.password.length < 12) {
      setMessage("Password must be at least 12 characters.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: form.token, email: form.email, password: form.password, name: form.name }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Setup failed.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setMessage("Admin account created! Redirecting to login...");
      setTimeout(() => { window.location.href = "/admin/login"; }, 2000);
    } catch {
      setMessage("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-deep)", padding: "var(--space-lg)" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      <div style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
          <Image src="/images/logo-icon.png" alt="Logo" width={72} height={72} style={{ margin: "0 auto var(--space-md)", borderRadius: "50%" }} />
          <h1 style={{ fontSize: "var(--text-xl)", marginBottom: 4 }}>Portfolio Setup</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>Create your admin account to get started</p>
        </div>

        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-xl)" }}>
          {setupStatus === "checking" && (
            <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Checking setup status...</p>
          )}

          {setupStatus === "done" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: "var(--space-md)" }}>✅</div>
              <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-sm)" }}>Already Set Up</h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "var(--space-lg)" }}>An admin account already exists.</p>
              <a href="/admin/login" className="btn btn-primary" style={{ display: "inline-flex" }}>Go to Login →</a>
            </div>
          )}

          {setupStatus === "error" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: "var(--space-md)" }}>⚠️</div>
              <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-sm)" }}>Setup Error</h2>
              <p style={{ color: "var(--text-muted)" }}>Could not connect to the database. Check your <code>.env.local</code> configuration.</p>
            </div>
          )}

          {setupStatus === "needed" && status !== "success" && (
            <form onSubmit={handleSubmit}>
              <div style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-md)", padding: "12px var(--space-md)", marginBottom: "var(--space-lg)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                💡 <strong style={{ color: "var(--accent)" }}>First-Time Setup</strong> — Set <code>ADMIN_SETUP_TOKEN</code> in your <code>.env.local</code> and enter it below.
              </div>

              <div className="form-group">
                <label className="form-label required" htmlFor="setup-token">Setup Token</label>
                <input id="setup-token" type="password" className="form-input" placeholder="From ADMIN_SETUP_TOKEN in .env.local" value={form.token} onChange={(e) => setForm((p) => ({ ...p, token: e.target.value }))} required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="setup-name">Your Name</label>
                <input id="setup-name" type="text" className="form-input" placeholder="Md Sakhawat Hossain" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              </div>

              <div className="form-group">
                <label className="form-label required" htmlFor="setup-email">Email Address</label>
                <input id="setup-email" type="email" className="form-input" placeholder="designersakhawat86@gmail.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
              </div>

              <div className="form-group">
                <label className="form-label required" htmlFor="setup-password">Password</label>
                <input id="setup-password" type="password" className="form-input" placeholder="Min. 12 characters" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required minLength={12} />
              </div>

              <div className="form-group">
                <label className="form-label required" htmlFor="setup-confirm">Confirm Password</label>
                <input id="setup-confirm" type="password" className="form-input" placeholder="Repeat password" value={form.confirm} onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))} required />
              </div>

              {message && (
                <div style={{ background: status === "error" ? "rgba(239,68,68,0.1)" : "rgba(200,240,0,0.1)", border: `1px solid ${status === "error" ? "rgba(239,68,68,0.25)" : "var(--accent-border)"}`, borderRadius: "var(--radius-md)", padding: "12px var(--space-md)", color: status === "error" ? "var(--danger)" : "var(--accent)", fontSize: "var(--text-sm)", marginBottom: "var(--space-md)" }}>
                  {message}
                </div>
              )}

              <button type="submit" className="btn btn-primary" disabled={status === "loading"} style={{ width: "100%", justifyContent: "center" }}>
                {status === "loading" ? "Creating account..." : "Create Admin Account →"}
              </button>
            </form>
          )}

          {status === "success" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: "var(--space-md)" }}>🎉</div>
              <p style={{ color: "var(--accent)" }}>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
