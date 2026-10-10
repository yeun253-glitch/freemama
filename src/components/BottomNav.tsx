"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "오늘의 자유", icon: "☀️" },
  { href: "/saved", label: "저장한 코스", icon: "🔖" },
  { href: "/bucket", label: "버킷리스트", icon: "✨" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-md justify-around pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-xs ${
                active ? "font-semibold text-accent" : "text-muted"
              }`}
            >
              <span className="text-lg" aria-hidden>
                {tab.icon}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
