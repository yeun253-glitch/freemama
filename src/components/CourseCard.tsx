"use client";

import { useState } from "react";
import { naverMapUrl, won, type Course } from "@/lib/course";

type Props = {
  course: Course;
  defaultOpen?: boolean;
  actions?: React.ReactNode;
};

export default function CourseCard({ course, defaultOpen = false, actions }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <article className="rounded-2xl border border-line bg-card p-4 shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">
              {course.vibe}
            </span>
            <h3 className="mt-2 text-lg font-bold">{course.title}</h3>
            <p className="mt-1 text-sm text-muted">{course.concept}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-sm font-semibold">{won(course.total_cost)}</div>
            <div className="mt-1 text-xs text-muted">{open ? "접기 ▲" : "자세히 ▼"}</div>
          </div>
        </div>
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <ol className="space-y-3 border-l-2 border-accent-soft pl-4">
            {course.steps.map((step, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[1.4rem] top-1 h-2.5 w-2.5 rounded-full bg-accent" />
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-semibold">
                    <span className="mr-2 text-sm text-muted">{step.start}</span>
                    {step.activity}
                  </p>
                  <span className="shrink-0 text-xs text-muted">
                    {step.minutes}분 · {won(step.cost)}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted">{step.detail}</p>
                <a
                  href={naverMapUrl(step.search)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-xs text-accent underline underline-offset-2"
                >
                  지도에서 &lsquo;{step.search}&rsquo; 찾기
                </a>
              </li>
            ))}
          </ol>
          <p className="rounded-xl bg-accent-soft px-3 py-2 text-sm">💡 {course.tip}</p>
        </div>
      )}

      {actions && <div className="mt-4 flex gap-2">{actions}</div>}
    </article>
  );
}
