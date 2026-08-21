import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource/tajawal/400.css";
import "@fontsource/tajawal/500.css";
import "@fontsource/tajawal/700.css";
import "@fontsource/tajawal/800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "حلو العقارية | Helw Real Estate",
  description:
    "شقق وفلل وشاليهات مختارة بعناية في أرقى مناطق مصر — مع نظام CRM متكامل لإدارة المشاريع والمبيعات. بيع وشراء وإيجار واستشارات استثمارية بضمان حلو العقارية.",
};

export const viewport: Viewport = {
  themeColor: "#0d2740",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
