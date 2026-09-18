import { query } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  const [projects, services, inquiries, media] = await Promise.all([
    query<{ count: number; status: string }>(
      "SELECT status, COUNT(*) as count FROM projects GROUP BY status"
    ),
    query<{ count: number }>("SELECT COUNT(*) as count FROM services WHERE deleted_at IS NULL"),
    query<{ count: number }>("SELECT COUNT(*) as count FROM inquiries WHERE read_at IS NULL"),
    query<{ count: number }>("SELECT COUNT(*) as count FROM media"),
  ]);

  const projectStats = projects.reduce((acc: Record<string, number>, row) => {
    acc[row.status] = row.count;
    return acc;
  }, {});

  const recentActivity = await query(
    "SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 10"
  );
  const recentInquiries = await query(
    "SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5"
  );

  const stats = [
    { label: "Published Projects", value: projectStats.published ?? 0, href: "/admin/projects?status=published", icon: "📁", color: "var(--accent)" },
    { label: "Draft Projects", value: projectStats.draft ?? 0, href: "/admin/projects?status=draft", icon: "📝", color: "var(--warning)" },
    { label: "Services", value: services[0]?.count ?? 0, href: "/admin/services", icon: "🎨", color: "var(--info)" },
    { label: "Unread Inquiries", value: inquiries[0]?.count ?? 0, href: "/admin/inquiries", icon: "✉️", color: (inquiries[0]?.count ?? 0) > 0 ? "var(--danger)" : "var(--success)" },
    { label: "Media Files", value: media[0]?.count ?? 0, href: "/admin/media", icon: "🖼️", color: "var(--text-secondary)" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h2 style={{ marginBottom: "var(--space-sm)" }}>Welcome back! 👋</h2>
        <p style={{ color: "var(--text-muted)" }}>Here&apos;s what&apos;s happening with your portfolio.</p>
      </div>

      {/* Stats grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "var(--space-md)",
        marginBottom: "var(--space-xl)",
      }}>
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: "none" }}>
            <div
              className="card"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-lg)",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: "var(--space-sm)" }}>{stat.icon}</div>
              <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, fontFamily: "Space Grotesk", color: stat.color, marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-xl)" }}>
        {/* Recent activity */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <div style={{ padding: "var(--space-lg)", borderBottom: "1px solid var(--bg-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "var(--text-base)" }}>Recent Activity</h3>
          </div>
          <div style={{ padding: "var(--space-md)" }}>
            {(recentActivity as Array<{ action: string; detail: string | null; created_at: string }>).length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-lg)" }}>No activity yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                {(recentActivity as Array<{ action: string; detail: string | null; created_at: string }>).map((log, i) => (
                  <div key={i} style={{ display: "flex", gap: "var(--space-sm)", alignItems: "flex-start", padding: "var(--space-sm) 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ width: 8, height: 8, background: "var(--accent)", borderRadius: "50%", marginTop: 6, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>{log.detail || log.action}</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: 2 }}>
                        {new Date(log.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent inquiries */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <div style={{ padding: "var(--space-lg)", borderBottom: "1px solid var(--bg-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "var(--text-base)" }}>Recent Inquiries</h3>
            <Link href="/admin/inquiries" style={{ color: "var(--accent)", fontSize: "var(--text-xs)" }}>View all →</Link>
          </div>
          <div style={{ padding: "var(--space-md)" }}>
            {(recentInquiries as Array<{ name: string; email: string; service: string | null; read_at: string | null; created_at: string }>).length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-lg)" }}>No inquiries yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                {(recentInquiries as Array<{ name: string; email: string; service: string | null; read_at: string | null; created_at: string }>).map((inq, i) => (
                  <Link key={i} href="/admin/inquiries" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "flex-start", padding: "var(--space-sm)", borderRadius: "var(--radius-sm)", background: inq.read_at ? "transparent" : "var(--accent-glow)", border: "1px solid", borderColor: inq.read_at ? "transparent" : "var(--accent-border)" }}>
                      <div style={{ width: 8, height: 8, background: inq.read_at ? "var(--text-muted)" : "var(--accent)", borderRadius: "50%", marginTop: 6, flexShrink: 0 }} />
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)", fontWeight: 600 }}>{inq.name}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{inq.service || "General inquiry"} · {new Date(inq.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: "var(--space-xl)" }}>
        <h3 style={{ marginBottom: "var(--space-md)", fontSize: "var(--text-base)" }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
          <Link href="/admin/projects/new" className="btn btn-primary btn-sm">+ New Project</Link>
          <Link href="/admin/services" className="btn btn-outline btn-sm">Manage Services</Link>
          <Link href="/admin/media" className="btn btn-outline btn-sm">Upload Media</Link>
          <Link href="/admin/settings" className="btn btn-outline btn-sm">Site Settings</Link>
        </div>
      </div>
    </div>
  );
}
