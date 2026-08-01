import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  Gauge,
  Layers3,
  LockKeyhole,
  MessageCircle,
  Music2,
  ShieldCheck,
  Sparkles,
  Zap
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { ModuleCard } from "@/components/ModuleCard";
import { listModules } from "@/lib/store";

export const dynamic = "force-dynamic";

const TIKTOK_FALLBACK = "https://www.tiktok.com/@ditzstoreofficial";
const CHANNEL_FALLBACK = "https://whatsapp.com/channel/0029Vb8avtoAInPrpNXC8v3A";

export default async function HomePage() {
  const modules = await listModules();
  const tiktok = process.env.NEXT_PUBLIC_TIKTOK_URL || TIKTOK_FALLBACK;
  const channel = process.env.NEXT_PUBLIC_CHANNEL_URL || CHANNEL_FALLBACK;
  const channelName = process.env.NEXT_PUBLIC_CHANNEL_NAME || "Saluran DiTz Store";

  return (
    <main className="site-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grid-noise" />

      <header className="site-header">
        <nav className="navbar shell">
          <Brand />
          <div className="nav-links desktop-only">
            <Link href="#modules">Module</Link>
            <Link href="#cara-kerja">Cara kerja</Link>
            <a href={channel} target="_blank" rel="noreferrer">Saluran</a>
          </div>
          <div className="nav-actions">
            <a className="nav-social desktop-only" href={tiktok} target="_blank" rel="noreferrer">
              <Music2 size={16} /> @ditzstoreofficial
            </a>
            <Link className="small-button" href="#modules">
              Download <ArrowRight size={15} />
            </Link>
          </div>
        </nav>
      </header>

      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> Official digital hub DiTz Store</div>
          <h1>
            Module resmi untuk<br />
            <span className="gradient-text">performa tanpa ribet.</span>
          </h1>
          <p>
            Download module gaming dan utility dari sumber resmi DiTz Store. Semua link dikelola melalui admin panel, dilindungi gate, dan diperbarui dari satu tempat.
          </p>

          <div className="hero-actions">
            <Link className="primary-button" href="#modules">
              <Download size={18} /> Jelajahi module <ArrowRight size={17} />
            </Link>
            <a className="glass-button" href={channel} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> Ikuti saluran
            </a>
          </div>

          <div className="trust-row">
            <span><BadgeCheck size={18} /> Sumber resmi</span>
            <span><ShieldCheck size={18} /> Link terlindungi</span>
            <span><Zap size={18} /> Update cepat</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Pratinjau DiTz Module Hub">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="floating-chip chip-one"><ShieldCheck size={16} /> Secure link</div>
          <div className="floating-chip chip-two"><Zap size={16} /> Fast access</div>

          <div className="app-preview">
            <div className="preview-topbar">
              <div className="preview-dots"><i /><i /><i /></div>
              <span>ditz-store.app</span>
              <LockKeyhole size={14} />
            </div>
            <div className="preview-body">
              <div className="preview-brandline">
                <img src="/logo.svg" alt="" />
                <div><strong>DiTz Module Hub</strong><small>Verified distribution center</small></div>
                <span className="online-badge">ONLINE</span>
              </div>

              <div className="preview-feature">
                <div className="preview-icon"><Gauge size={24} /></div>
                <div className="preview-feature-copy">
                  <span className="mini-kicker">FEATURED RELEASE</span>
                  <strong>Gaming Performance Module</strong>
                  <small>Stable build • Android ready</small>
                </div>
                <button aria-label="Download"><Download size={18} /></button>
              </div>

              <div className="preview-metrics">
                <div><span><Boxes size={16} /> Module</span><strong>{modules.length.toString().padStart(2, "0")}</strong></div>
                <div><span><ShieldCheck size={16} /> Status</span><strong>SAFE</strong></div>
                <div><span><Layers3 size={16} /> Access</span><strong>24/7</strong></div>
              </div>

              <div className="preview-console">
                <div><span className="console-green">●</span> Gate protection active</div>
                <div><span className="console-purple">●</span> Official channel connected</div>
                <div><span className="console-cyan">●</span> Download source encrypted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="proof-bar">
        <div className="shell proof-content">
          <div className="proof-item"><strong>100%</strong><span>Dikelola DiTz Store</span></div>
          <div className="proof-divider" />
          <div className="proof-item"><strong>1 HUB</strong><span>Semua module resmi</span></div>
          <div className="proof-divider" />
          <div className="proof-item"><strong>2 STEP</strong><span>Gate sebelum download</span></div>
          <div className="proof-socials">
            <a href={tiktok} target="_blank" rel="noreferrer"><Music2 size={17} /> TikTok resmi <ExternalLink size={13} /></a>
            <a href={channel} target="_blank" rel="noreferrer"><MessageCircle size={17} /> {channelName} <ExternalLink size={13} /></a>
          </div>
        </div>
      </section>

      <section id="modules" className="modules-section shell">
        <div className="section-heading">
          <div>
            <span className="section-kicker"><Sparkles size={15} /> MODULE LIBRARY</span>
            <h2>Rilis terbaru dari<br /><span>DiTz Store.</span></h2>
          </div>
          <p>Pilih module, selesaikan gate resmi, lalu link MediaFire akan dibuka otomatis.</p>
        </div>

        {modules.length ? (
          <div className="module-grid">
            {modules.map((item, index) => <ModuleCard key={item.id} item={item} index={index} />)}
          </div>
        ) : (
          <div className="empty-state">Belum ada module aktif. Cek kembali nanti.</div>
        )}
      </section>

      <section id="cara-kerja" className="process-section shell">
        <div className="process-intro">
          <span className="section-kicker">DOWNLOAD FLOW</span>
          <h2>Simpel, jelas, dan tetap aman.</h2>
          <p>Gate membantu pengguna masuk lewat akun resmi sebelum diarahkan ke file.</p>
        </div>
        <div className="process-grid">
          <article><span>01</span><div className="process-icon"><Boxes size={22} /></div><h3>Pilih module</h3><p>Buka module yang cocok dan lihat detail versi, ukuran, serta kategori.</p></article>
          <article><span>02</span><div className="process-icon"><CheckCircle2 size={22} /></div><h3>Selesaikan gate</h3><p>Buka TikTok resmi dan saluran WhatsApp, lalu lakukan konfirmasi.</p></article>
          <article><span>03</span><div className="process-icon"><Download size={22} /></div><h3>Masuk ke download</h3><p>Server baru mengirim URL tujuan setelah seluruh proses selesai.</p></article>
        </div>
      </section>

      <section className="cta-section shell">
        <div className="cta-glow" />
        <div>
          <span className="section-kicker">OFFICIAL CHANNEL</span>
          <h2>Jangan lewatkan update module berikutnya.</h2>
          <p>Pengumuman versi baru, link terbaru, dan info resmi dibagikan melalui saluran DiTz Store.</p>
        </div>
        <a className="light-button" href={channel} target="_blank" rel="noreferrer">
          Gabung saluran <ChevronRight size={18} />
        </a>
      </section>

      <footer className="footer shell">
        <Brand />
        <p>© 2026 DiTz Store. Official Module Distribution Hub.</p>
        <div className="footer-links">
          <a href={tiktok} target="_blank" rel="noreferrer">TikTok</a>
          <a href={channel} target="_blank" rel="noreferrer">WhatsApp</a>
          <Link href="/admin/login">Admin</Link>
        </div>
      </footer>
    </main>
  );
}
