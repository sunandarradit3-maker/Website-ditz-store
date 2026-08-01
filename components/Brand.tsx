import Image from "next/image";
import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="DiTz Store">
      <span className="brand-logo"><Image src="/logo.svg" width={46} height={46} alt="Logo DiTz Store" priority /></span>
      {!compact && (
        <span className="brand-copy">
          <strong>DiTz Store</strong>
          <small>OFFICIAL MODULE HUB</small>
        </span>
      )}
    </Link>
  );
}
