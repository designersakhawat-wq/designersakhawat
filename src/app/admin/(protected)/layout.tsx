import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin Panel | Md Sakhawat Hossain",
  robots: { index: false, follow: false },
};

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  try {
    session = await getSession();
  } catch {
    // DB not available — still allow access to see the error properly
    redirect("/admin/login");
  }

  // Redirect to login if not authenticated
  if (!session?.isLoggedIn) {
    redirect("/admin/login");
  }

  return (
    <AdminShell adminName={session.adminName || "Admin"}>
      {children}
    </AdminShell>
  );
}
