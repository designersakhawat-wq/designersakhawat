"use client";

import { useState } from "react";

interface FloatingWhatsAppProps {
  number?: string;
  message?: string;
}

export default function FloatingWhatsApp({
  number = "8801781955355",
  message = "Hi Sakhawat, I would like to discuss a design project.",
}: FloatingWhatsAppProps) {
  const [hovered, setHovered] = useState(false);

  const cleanNumber = number.replace(/[^0-9]/g, "");
  const encodedMsg = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMsg}`;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Tooltip on hover */}
      {hovered && (
        <div
          style={{
            background: "var(--bg-elevated)",
            color: "var(--text-primary)",
            padding: "8px 14px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--accent-border)",
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
            animation: "fadeIn 0.2s ease",
          }}
        >
          <span style={{ color: "var(--accent)", marginRight: 6 }}>●</span>
          Chat on WhatsApp (Online)
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Md Sakhawat Hossain on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 20px rgba(37, 211, 102, 0.45)",
          transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          transform: hovered ? "scale(1.1) translateY(-2px)" : "scale(1)",
          textDecoration: "none",
          position: "relative",
        }}
      >
        {/* Pulsing ring */}
        <span
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "2px solid #25D366",
            opacity: 0.7,
            animation: "pulseRing 2s infinite",
          }}
        />

        {/* WhatsApp Icon SVG */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </a>
    </div>
  );
}
