import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="center-page">
      <div className="not-found-card">
        <SearchX size={44} />
        <h1>Module tidak ditemukan</h1>
        <p>Link mungkin salah, sudah dihapus, atau sedang dinonaktifkan oleh admin.</p>
        <Link href="/" className="primary-button">Kembali ke beranda</Link>
      </div>
    </main>
  );
}
