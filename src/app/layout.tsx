import type { Metadata, Viewport } from "next";
import { Gowun_Batang } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const serif = Gowun_Batang({
  weight: ["400", "700"],
  preload: false,
  variable: "--font-gowun-batang",
});

export const metadata: Metadata = {
  title: "자유부인",
  description: "나를 위한 시간, 가장 아름답게.",
  appleWebApp: { capable: true, title: "자유부인", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#fbf7f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={serif.variable}>
      <body className="antialiased">
        <main className="mx-auto min-h-dvh max-w-md px-4 pb-28 pt-6">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
