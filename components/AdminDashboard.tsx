"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Pencil,
  Plus,
  Save,
  Trash2,
  X
} from "lucide-react";
import type { ModuleItem } from "@/lib/types";
import { slugify } from "@/lib/validation";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  version: "v1.0.0",
  size: "",
  category: "Gaming",
  downloadUrl: "",
  active: true
};

export function AdminDashboard({ initialItems }: { initialItems: ModuleItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const activeCount = useMemo(() => items.filter((item) => item.active).length, [items]);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startEdit(item: ModuleItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description,
      version: item.version,
      size: item.size,
      category: item.category,
      downloadUrl: item.downloadUrl,
      active: item.active
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    const endpoint = editingId ? `/api/modules/${editingId}` : "/api/modules";
    const response = await fetch(endpoint, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Gagal menyimpan data");
      setSaving(false);
      return;
    }
    setItems((current) =>
      editingId
        ? current.map((item) => (item.id === editingId ? result.item : item))
        : [result.item, ...current]
    );
    setMessage(editingId ? "Module berhasil diperbarui." : "Module baru berhasil ditambahkan.");
    resetForm();
    setSaving(false);
    router.refresh();
  }

  async function removeItem(id: string) {
    if (!window.confirm("Hapus module ini? Link publiknya akan langsung tidak tersedia.")) return;
    const response = await fetch(`/api/modules/${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Gagal menghapus module");
      return;
    }
    setItems((current) => current.filter((item) => item.id !== id));
    setMessage("Module berhasil dihapus.");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function copyLink(slug: string) {
    await navigator.clipboard.writeText(`${window.location.origin}/download/${slug}`);
    setMessage("Link download disalin.");
  }

  return (
    <div className="admin-shell shell">
      <aside className="admin-sidebar">
        <div className="admin-nav-title"><LayoutDashboard size={20} /> Dashboard</div>
        <div className="admin-stat"><small>Total module</small><strong>{items.length}</strong></div>
        <div className="admin-stat"><small>Module aktif</small><strong>{activeCount}</strong></div>
        <button className="sidebar-logout" onClick={logout}><LogOut size={17} /> Keluar</button>
      </aside>

      <section className="admin-main">
        <div className="admin-heading">
          <div>
            <span className="section-kicker">CONTENT MANAGER</span>
            <h1>Module & Download Links</h1>
            <p>Tambah slug baru, ubah link MediaFire, dan atur status publik.</p>
          </div>
        </div>

        <form className="admin-form" onSubmit={submit}>
          <div className="form-title-row">
            <div>
              <h2>{editingId ? "Edit module" : "Tambah module baru"}</h2>
              <p>Link publik otomatis menjadi <code>/download/nama-slug</code>.</p>
            </div>
            {editingId && <button type="button" className="icon-button" onClick={resetForm}><X size={18} /></button>}
          </div>

          <div className="form-grid">
            <label className="field"><span>Nama module</span><input value={form.title} onChange={(e) => {
              updateField("title", e.target.value);
              if (!editingId) updateField("slug", slugify(e.target.value));
            }} required placeholder="DiTz Gaming Performance Module" /></label>
            <label className="field"><span>Slug link</span><input value={form.slug} onChange={(e) => updateField("slug", slugify(e.target.value))} required placeholder="module-gaming-ditz-store" /></label>
            <label className="field full-field"><span>Deskripsi</span><textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} required rows={4} placeholder="Penjelasan singkat module..." /></label>
            <label className="field"><span>Versi</span><input value={form.version} onChange={(e) => updateField("version", e.target.value)} required /></label>
            <label className="field"><span>Ukuran file</span><input value={form.size} onChange={(e) => updateField("size", e.target.value)} required placeholder="12 MB" /></label>
            <label className="field"><span>Kategori</span><input value={form.category} onChange={(e) => updateField("category", e.target.value)} required /></label>
            <label className="field"><span>Link MediaFire / download</span><input type="url" value={form.downloadUrl} onChange={(e) => updateField("downloadUrl", e.target.value)} required placeholder="https://www.mediafire.com/file/..." /></label>
          </div>

          <label className="switch-row">
            <input type="checkbox" checked={form.active} onChange={(e) => updateField("active", e.target.checked)} />
            <span><strong>Tampilkan secara publik</strong><small>Jika dimatikan, link download akan menjadi 404.</small></span>
          </label>

          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success"><CheckCircle2 size={17} /> {message}</p>}

          <button className="primary-button" disabled={saving}>
            {saving ? <LoaderCircle className="spin" size={18} /> : editingId ? <Save size={18} /> : <Plus size={18} />}
            {saving ? "Menyimpan..." : editingId ? "Simpan perubahan" : "Tambah module"}
          </button>
        </form>

        <div className="admin-list">
          <div className="list-heading"><h2>Semua module</h2><span>{items.length} item</span></div>
          {items.length === 0 ? <div className="empty-state">Belum ada module.</div> : items.map((item) => (
            <article className="admin-item" key={item.id}>
              <div className="admin-item-main">
                <div className={`status-dot ${item.active ? "active" : ""}`} />
                <div>
                  <div className="item-title-row"><h3>{item.title}</h3><span className={item.active ? "status-active" : "status-off"}>{item.active ? "Aktif" : "Nonaktif"}</span></div>
                  <p>{item.description}</p>
                  <div className="item-meta"><code>/download/{item.slug}</code><span>{item.version}</span><span>{item.size}</span></div>
                </div>
              </div>
              <div className="item-actions">
                <button title="Salin link" onClick={() => copyLink(item.slug)}><Copy size={17} /></button>
                <a title="Buka link" href={`/download/${item.slug}`} target="_blank"><ExternalLink size={17} /></a>
                <button title="Edit" onClick={() => startEdit(item)}><Pencil size={17} /></button>
                <button className="danger" title="Hapus" onClick={() => removeItem(item.id)}><Trash2 size={17} /></button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
