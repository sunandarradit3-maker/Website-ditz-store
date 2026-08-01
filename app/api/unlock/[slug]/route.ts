import { NextResponse } from "next/server";
import { verifyGateToken } from "@/lib/gate";
import { getModuleBySlug } from "@/lib/store";

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const body = await request.json().catch(() => null);
  const token = String(body?.token ?? "");
  const confirmed = body?.confirmed === true;

  if (!confirmed) {
    return NextResponse.json({ error: "Konfirmasi belum diberikan" }, { status: 400 });
  }

  const verification = verifyGateToken(token, slug);
  if (!verification.ok) {
    return NextResponse.json({ error: verification.error }, { status: 400 });
  }

  const item = await getModuleBySlug(slug);
  if (!item) {
    return NextResponse.json({ error: "Module tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(
    { downloadUrl: item.downloadUrl },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
