import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/AdminLogin";
import { Brand } from "@/components/Brand";
import { isAdmin } from "@/lib/auth";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="admin-login-page">
      <nav className="navbar shell"><Brand /></nav>
      <div className="login-wrap"><AdminLogin /></div>
    </main>
  );
}
