import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DiTz Store — Official Module Hub",
  description: "Pusat download module resmi DiTz Store, saluran resmi, dan link distribusi yang dikelola melalui admin panel.",
  openGraph: {
    title: "DiTz Store Module Hub",
    description: "Download module resmi DiTz Store melalui gate yang aman.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
