import type { ModuleInput } from "./types";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function validateModule(body: unknown): ModuleInput {
  if (!body || typeof body !== "object") throw new Error("Data tidak valid");
  const value = body as Record<string, unknown>;

  const text = (key: string, max = 300) => {
    const result = String(value[key] ?? "").trim();
    if (!result) throw new Error(`${key} wajib diisi`);
    if (result.length > max) throw new Error(`${key} terlalu panjang`);
    return result;
  };

  const title = text("title", 100);
  const slug = slugify(text("slug", 120));
  const description = text("description", 500);
  const version = text("version", 30);
  const size = text("size", 30);
  const category = text("category", 50);
  const downloadUrl = text("downloadUrl", 500);

  let parsed: URL;
  try {
    parsed = new URL(downloadUrl);
  } catch {
    throw new Error("Link download tidak valid");
  }
  if (!["https:", "http:"].includes(parsed.protocol)) {
    throw new Error("Link download harus HTTP/HTTPS");
  }

  return {
    title,
    slug,
    description,
    version,
    size,
    category,
    downloadUrl,
    active: value.active !== false
  };
}
