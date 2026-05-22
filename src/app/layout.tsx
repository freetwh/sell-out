import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2026 外贸技能知识指引",
  description:
    "面向中国工厂和贸易公司的 B2B 外贸获客、转化、交易、收款、发货与售后操作指南。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
