import "@fontsource/tajawal/400.css";
import "@fontsource/tajawal/500.css";
import "@fontsource/tajawal/700.css";
import "@fontsource/tajawal/800.css";
import "./globals.css";

export const metadata = {
  title: "حلو العقارية | Helw Real Estate",
  description:
    "شقق وفلل وشاليهات مختارة بعناية في أرقى مناطق مصر. بيع وشراء وإيجار واستشارات استثمارية بضمان حلو العقارية.",
};

export const viewport = {
  themeColor: "#0d2740",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
