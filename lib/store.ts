import { seedModules } from "./seed";
import type { ModuleInput, ModuleItem } from "./types";

const KEY = "ditz:module-hub:modules";
let memoryStore: ModuleItem[] = structuredClone(seedModules);

const hasRedis = () =>
  Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

async function redis(command: unknown[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Redis belum dikonfigurasi");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store"
  });

  if (!response.ok) throw new Error(`Redis error: ${response.status}`);
  const payload = await response.json();
  if (payload.error) throw new Error(payload.error);
  return payload.result;
}

async function readAll(): Promise<ModuleItem[]> {
  if (!hasRedis()) return memoryStore;
  const raw = await redis(["GET", KEY]);
  if (!raw) {
    await redis(["SET", KEY, JSON.stringify(seedModules)]);
    return structuredClone(seedModules);
  }
  return JSON.parse(raw) as ModuleItem[];
}

async function writeAll(items: ModuleItem[]) {
  if (!hasRedis()) {
    memoryStore = items;
    return;
  }
  await redis(["SET", KEY, JSON.stringify(items)]);
}

export async function listModules(includeInactive = false) {
  const items = await readAll();
  return items
    .filter((item) => includeInactive || item.active)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getModuleBySlug(slug: string) {
  const items = await readAll();
  return items.find((item) => item.slug === slug && item.active) ?? null;
}

export async function createModule(input: ModuleInput) {
  const items = await readAll();
  if (items.some((item) => item.slug === input.slug)) {
    throw new Error("Slug sudah digunakan");
  }

  const now = new Date().toISOString();
  const item: ModuleItem = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now
  };
  await writeAll([item, ...items]);
  return item;
}

export async function updateModule(id: string, input: Partial<ModuleInput>) {
  const items = await readAll();
  const current = items.find((item) => item.id === id);
  if (!current) throw new Error("Module tidak ditemukan");

  if (
    input.slug &&
    items.some((item) => item.slug === input.slug && item.id !== id)
  ) {
    throw new Error("Slug sudah digunakan");
  }

  const updated = {
    ...current,
    ...input,
    updatedAt: new Date().toISOString()
  };
  await writeAll(items.map((item) => (item.id === id ? updated : item)));
  return updated;
}

export async function deleteModule(id: string) {
  const items = await readAll();
  if (!items.some((item) => item.id === id)) {
    throw new Error("Module tidak ditemukan");
  }
  await writeAll(items.filter((item) => item.id !== id));
}
