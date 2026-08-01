import crypto from "node:crypto";

const MIN_WAIT_SECONDS = 5;
const MAX_TOKEN_AGE_SECONDS = 60 * 30;

type GatePayload = {
  slug: string;
  issuedAt: number;
};

function secret() {
  return process.env.SESSION_SECRET || "dev-only-change-this-secret";
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createGateToken(slug: string) {
  const payload: GatePayload = {
    slug,
    issuedAt: Math.floor(Date.now() / 1000)
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyGateToken(token: string, slug: string) {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return { ok: false, error: "Token tidak valid" } as const;

  const expected = sign(encoded);
  if (
    expected.length !== signature.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  ) {
    return { ok: false, error: "Token tidak valid" } as const;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as GatePayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.slug !== slug) return { ok: false, error: "Token salah" } as const;
    if (now - payload.issuedAt < MIN_WAIT_SECONDS) {
      return { ok: false, error: "Tunggu beberapa detik sebelum membuka link" } as const;
    }
    if (now - payload.issuedAt > MAX_TOKEN_AGE_SECONDS) {
      return { ok: false, error: "Token kedaluwarsa. Muat ulang halaman." } as const;
    }
    return { ok: true } as const;
  } catch {
    return { ok: false, error: "Token tidak valid" } as const;
  }
}
