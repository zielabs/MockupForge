import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MockupForge — Buat Mockup Produk Profesional",
  description: "Platform mockup produk terbaik di Indonesia. Buat mockup topi, gelas, baju, hoodie, dan lainnya dalam hitungan detik.",
  keywords: ["mockup", "mockup generator", "desain produk", "mockup baju", "mockup topi", "mockup gelas"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
