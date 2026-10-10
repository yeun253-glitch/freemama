"use client";

import { useEffect, useState } from "react";

const LINES = ["오늘의 기분을 살피고 있어요", "동네의 좋은 곳을 고르고 있어요", "시간에 맞춰 동선을 그리고 있어요"];

export default function LoadingCourses() {
  const [line, setLine] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setLine((l) => (l + 1) % LINES.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="loading" aria-live="polite" className="space-y-4">
      <p className="text-center font-serif text-accent">{LINES[line]}</p>
      {[0, 1, 2].map((i) => (
        <div key={i} className="animate-pulse rounded-3xl border border-line bg-card p-6">
          <div className="h-3 w-16 rounded-full bg-accent-soft" />
          <div className="mt-3 h-5 w-2/3 rounded-full bg-accent-soft" />
          <div className="mt-6 space-y-3">
            <div className="h-3 rounded-full bg-line" />
            <div className="h-3 rounded-full bg-line" />
            <div className="h-3 w-4/5 rounded-full bg-line" />
          </div>
        </div>
      ))}
    </section>
  );
}
