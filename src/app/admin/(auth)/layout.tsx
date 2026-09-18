// Auth layout — no session guard; login and setup pages are publicly accessible
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
