import React from "react";

export default function StatsRibbon() {
  const stats = [
    { num: "3+", label: "Years Experience", sub: "Commercial Mastery" },
    { num: "590+", label: "Projects Delivered", sub: "100% Vector Precision" },
    { num: "37+", label: "Global Clients", sub: "US, Europe & Gulf" },
    { num: "99.4%", label: "5-Star Rating", sub: "Client Endorsement" },
  ];

  return (
    <section className="stats-ribbon" aria-label="Key Performance Statistics">
      <div className="container">
        <div className="stats-ribbon-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stats-ribbon-item">
              <span className="stats-ribbon-num">{stat.num}</span>
              <span className="stats-ribbon-label">{stat.label}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
