import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "자유부인",
  description: "어렵게 얻은 자유 시간, 후회 없이 쓰는 코스를 1분 만에.",
  appleWebApp: { capable: true, title: "자유부인", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#d9667a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <main className="mx-auto min-h-dvh max-w-md px-4 pb-28 pt-6">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
