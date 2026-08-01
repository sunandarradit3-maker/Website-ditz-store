import { notFound } from "next/navigation";
import { Brand } from "@/components/Brand";
import { DownloadGate } from "@/components/DownloadGate";
import { getModuleBySlug } from "@/lib/store";
import { createGateToken } from "@/lib/gate";

export const dynamic = "force-dynamic";

export default async function DownloadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getModuleBySlug(slug);
  if (!item) notFound();

  return (
    <main className="download-page">
      <nav className="navbar shell"><Brand /></nav>
      <div className="shell"><DownloadGate item={item} gateToken={createGateToken(item.slug)} /></div>
    </main>
  );
}
