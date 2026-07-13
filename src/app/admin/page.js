import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const admin = token ? verifyAdminToken(token) : null;

  if (!admin) redirect("/admin-login");

  return <AdminDashboard admin={admin} />;
}