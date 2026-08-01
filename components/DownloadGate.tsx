"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  Download,
  ExternalLink,
  LoaderCircle,
  LockKeyhole,
  MessageCircle,
  Music2,
  Radio,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import type { ModuleItem } from "@/lib/types";

const WAIT_SECONDS = 5;
type PublicModule = Omit<ModuleItem, "downloadUrl">;

export function DownloadGate({ item, gateToken }: { item: PublicModule; gateToken: string }) {
  const [tiktokOpened, setTiktokOpened] = useState(false);
  const [channelOpened, setChannelOpened] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [seconds, setSeconds] = useState(WAIT_SECONDS);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState("");

  const tiktok = process.env.NEXT_PUBLIC_TIKTOK_URL || "https://www.tiktok.com/@ditzstoreofficial";
  const channel = process.env.NEXT_PUBLIC_CHANNEL_URL || "https://whatsapp.com/channel/0029Vb8avtoAInPrpNXC8v3A";
  const channelName = process.env.NEXT_PUBLIC_CHANNEL_NAME || "Saluran DiTz Store";
  const actionsDone = tiktokOpened && channelOpened;
  const progress = (Number(tiktokOpened) + Number(channelOpened) + Number(confirmed)) / 3 * 100;

  useEffect(() => {
    if (!actionsDone || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [actionsDone, seconds]);

  const unlocked = useMemo(() => actionsDone && confirmed && seconds === 0, [actionsDone, confirmed, seconds]);

  const openAction = (url: string, setter: (value: boolean) => void) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setter(true);
  };

  async function openDownload() {
    if (!unlocked || opening) return;
    setOpening(true);
    setError("");
    const response = await fetch(`/api/unlock/${encodeURIComponent(item.slug)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: gateToken, confirmed: true })
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Link gagal dibuka");
      setOpening(false);
      return;
    }
    window.location.assign(result.downloadUrl);
  }

  return (
    <div className="download-shell">
      <div className="download-nav">
        <Link href="/"><ChevronLeft size={17} /> Kembali ke module</Link>
        <span><ShieldCheck size={15} /> Secure distribution</span>
      </div>

      <div className="gate-layout">
        <section className="download-card">
          <div className="download-card-pattern" />
          <div className="download-icon"><Download size={31} /></div>
          <span className="verified-line"><BadgeCheck size={16} /> OFFICIAL DITZ RELEASE</span>
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          <div className="download-meta">
            <div><small>VERSION</small><strong>{item.version}</strong></div>
            <div><small>SIZE</small><strong>{item.size}</strong></div>
            <div><small>CATEGORY</small><strong>{item.category}</strong></div>
          </div>
          <div className="release-note"><Sparkles size={16} /><span>File tujuan hanya dikirim server setelah gate selesai.</span></div>
        </section>

        <section className="gate-card">
          <div className="gate-title">
            <div className="gate-lock"><LockKeyhole size={23} /></div>
            <span><small>DOWNLOAD GATE</small><strong>Buka akses module</strong></span>
            <span className="gate-count">{Math.round(progress)}%</span>
          </div>

          <div className="gate-progress"><span style={{ width: `${progress}%` }} /></div>
          <p className="gate-description">Selesaikan langkah berikut untuk memastikan kamu masuk melalui akun resmi DiTz Store.</p>

          <button className={`action-step ${tiktokOpened ? "done" : ""}`} onClick={() => openAction(tiktok, setTiktokOpened)}>
            <span className="step-number">{tiktokOpened ? <Check size={18} /> : <Music2 size={18} />}</span>
            <span><strong>Follow TikTok resmi</strong><small>@ditzstoreofficial</small></span>
            <span className="step-state">{tiktokOpened ? "Dibuka" : "Buka"}</span>
            <ExternalLink size={17} />
          </button>

          <button className={`action-step ${channelOpened ? "done" : ""}`} onClick={() => openAction(channel, setChannelOpened)}>
            <span className="step-number">{channelOpened ? <Check size={18} /> : <MessageCircle size={18} />}</span>
            <span><strong>Ikuti saluran resmi</strong><small>{channelName}</small></span>
            <span className="step-state">{channelOpened ? "Dibuka" : "Buka"}</span>
            <ExternalLink size={17} />
          </button>

          <label className={`confirm-box ${actionsDone ? "enabled" : ""} ${confirmed ? "checked" : ""}`}>
            <input type="checkbox" disabled={!actionsDone} checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
            <span className="custom-check">{confirmed && <Check size={15} />}</span>
            <span><strong>Konfirmasi aktivitas</strong><small>Saya sudah mengikuti TikTok dan saluran resmi.</small></span>
          </label>

          <button className="primary-button full unlock-button" disabled={!unlocked || opening} onClick={openDownload}>
            {opening ? <LoaderCircle className="spin" size={18} /> : unlocked ? <Download size={19} /> : <LockKeyhole size={18} />}
            {opening ? "Membuka MediaFire..." : unlocked ? "Buka link MediaFire" : !actionsDone ? "Selesaikan dua langkah" : seconds > 0 ? `Menyiapkan link • ${seconds}s` : "Centang konfirmasi"}
            {unlocked && !opening && <ExternalLink size={17} />}
          </button>

          {error && <p className="form-error">{error}</p>}
          <div className="gate-security"><ShieldCheck size={15} /> Link tidak ditampilkan di source halaman.</div>
          <p className="verification-disclaimer"><Radio size={14} /> Verifikasi follow otomatis memerlukan API resmi platform.</p>
        </section>
      </div>
    </div>
  );
}
