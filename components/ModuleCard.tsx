import Link from "next/link";
import { ArrowUpRight, Cpu, Download, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import type { ModuleItem } from "@/lib/types";

const icons = [Gauge, Cpu, Sparkles];

export function ModuleCard({ item, index = 0 }: { item: ModuleItem; index?: number }) {
  const Icon = icons[index % icons.length];
  return (
    <article className="module-card">
      <div className="module-card-glow" />
      <div className="card-topline">
        <span className="category-pill"><Icon size={14} /> {item.category}</span>
        <span className="safe-label"><ShieldCheck size={14} /> Official</span>
      </div>
      <div className="module-symbol"><Icon size={30} /></div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <div className="meta-row">
        <div><small>VERSION</small><strong>{item.version}</strong></div>
        <div><small>FILE SIZE</small><strong>{item.size}</strong></div>
      </div>
      <Link className="module-download" href={`/download/${item.slug}`}>
        <span><Download size={18} /> Download module</span><ArrowUpRight size={18} />
      </Link>
    </article>
  );
}
