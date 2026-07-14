import { requireAdmin } from "@/lib/adminAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }) {
  const admin = await requireAdmin();

  return (
    <div className="flex flex-col md:flex-row">
      <AdminSidebar admin={admin} />
      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-10 max-w-5xl">{children}</main>
    </div>
  );
}