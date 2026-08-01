import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";
import { Brand } from "@/components/Brand";
import { isAdmin } from "@/lib/auth";
import { listModules } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const items = await listModules(true);
  return (
    <main className="admin-page">
      <nav className="navbar shell"><Brand /></nav>
      <AdminDashboard initialItems={items} />
    </main>
  );
}
