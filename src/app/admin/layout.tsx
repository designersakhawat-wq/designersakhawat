// Root admin layout — minimal wrapper; session protection is applied per route group.
// (auth) group: login, setup — no auth required
// (protected) group: dashboard, services, projects, etc. — auth required
export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
