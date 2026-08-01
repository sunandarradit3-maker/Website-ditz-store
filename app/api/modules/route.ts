import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createModule, listModules } from "@/lib/store";
import { validateModule } from "@/lib/validation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const wantsAll = url.searchParams.get("all") === "1";
  const admin = wantsAll ? await isAdmin() : false;
  const items = await listModules(wantsAll && admin);
  const safeItems = wantsAll && admin
    ? items
    : items.map(({ downloadUrl: _downloadUrl, ...item }) => item);
  return NextResponse.json({ items: safeItems });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const item = await createModule(validateModule(body));
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menambah module" },
      { status: 400 }
    );
  }
}
