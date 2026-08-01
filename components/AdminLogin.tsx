"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LockKeyhole, LogIn, UserRound } from "lucide-react";

export function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: form.get("username"), password: form.get("password") })
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Login gagal");
      setLoading(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="login-card" onSubmit={submit}>
      <div className="login-icon"><LockKeyhole size={26} /></div>
      <span className="section-kicker">PRIVATE ACCESS</span>
      <h1>Admin DiTz Store</h1>
      <p>Masuk untuk mengelola module dan link download.</p>

      <label className="field">
        <span>Username</span>
        <div><UserRound size={17} /><input name="username" required autoComplete="username" /></div>
      </label>
      <label className="field">
        <span>Password</span>
        <div><LockKeyhole size={17} /><input type="password" name="password" required autoComplete="current-password" /></div>
      </label>
      {error && <p className="form-error">{error}</p>}
      <button className="primary-button full" disabled={loading}>
        {loading ? <LoaderCircle className="spin" size={18} /> : <LogIn size={18} />}
        {loading ? "Memproses..." : "Masuk admin panel"}
      </button>
    </form>
  );
}
