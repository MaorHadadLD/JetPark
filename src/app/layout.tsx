import type { Metadata, Viewport } from "next";
import { Assistant, Bellefair } from "next/font/google";
import "./globals.css";

const display = Bellefair({
  variable: "--font-display",
  weight: "400",
  subsets: ["hebrew", "latin"],
  display: "swap",
});

const text = Assistant({
  variable: "--font-text",
  weight: ["400", "500", "600"],
  subsets: ["hebrew", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JetPark – אתם לטיסה. אנחנו לרכב.",
  description:
    "נציג JetPark מקבל מכם את הרכב לפני הטיסה ומחזיר לכם אותו כשאתם חוזרים, בטרמינל 1 או בטרמינל 3 בנתב״ג.",
};

export const viewport: Viewport = {
  themeColor: "#2b2216",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${display.variable} ${text.variable}`}>
      <body>{children}</body>
    </html>
  );
}
