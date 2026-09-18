"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-deep)",
      padding: "var(--space-lg)",
    }}>
      {/* Background pattern */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      <div style={{
        width: "100%",
        maxWidth: "400px",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
          <Image
            src="/images/logo-icon.png"
            alt="Md Sakhawat Hossain"
            width={72}
            height={72}
            style={{ margin: "0 auto var(--space-md)", borderRadius: "50%" }}
          />
          <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "4px" }}>Admin Panel</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--bg-border)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-xl)",
        }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">Email Address</label>
              <input
                id="admin-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: "var(--radius-md)",
                padding: "12px var(--space-md)",
                color: "var(--danger)",
                fontSize: "var(--text-sm)",
                marginBottom: "var(--space-md)",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="animate-spin" style={{
                    display: "inline-block", width: 16, height: 16,
                    border: "2px solid currentColor", borderTopColor: "transparent",
                    borderRadius: "50%",
                  }} />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        <p style={{
          textAlign: "center",
          marginTop: "var(--space-lg)",
          color: "var(--text-muted)",
          fontSize: "var(--text-xs)",
        }}>
          First time? Visit <a href="/admin/setup" style={{ color: "var(--accent)" }}>/admin/setup</a> to create your account.
        </p>
      </div>
    </div>
  );
}
