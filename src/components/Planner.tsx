"use client";

import { useEffect, useState } from "react";
import Chip from "@/components/Chip";
import CourseCard from "@/components/CourseCard";
import type { Budget, Course, Mood } from "@/lib/course";
import { newId, store } from "@/lib/storage";

const HOURS = [2, 3, 4, 6, 8];

const MOOD_OPTIONS: { value: Mood; label: string }[] = [
  { value: "회복", label: "🌿 쉬기" },
  { value: "재미", label: "🎉 놀기" },
  { value: "성취", label: "📚 배우기" },
  { value: "혼자만의 시간", label: "☕ 혼자" },
];

const BUDGET_OPTIONS: { value: Budget; label: string }[] = [
  { value: "0원", label: "무료" },
  { value: "3만원 이하", label: "3만원" },
  { value: "10만원 이하", label: "10만원" },
  { value: "상관없음", label: "상관없음" },
];

export default function Planner() {
  const [hours, setHours] = useState(4);
  const [mood, setMood] = useState<Mood>("회복");
  const [budget, setBudget] = useState<Budget>("3만원 이하");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [savedTitles, setSavedTitles] = useState<string[]>([]);

  useEffect(() => setArea(store.lastArea()), []);

  async function plan() {
    if (!area.trim()) {
      setError("동네를 적어 주세요");
      return;
    }
    setError("");
    setLoading(true);
    setCourses([]);
    setSavedTitles([]);
    store.setLastArea(area.trim());

    const bucket = store
      .bucket()
      .filter((b) => !b.done)
      .map((b) => b.text);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours, mood, budget, area: area.trim(), bucket, now: new Date().toISOString() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "다시 시도해 주세요");
      setCourses(data.courses);
      requestAnimationFrame(() =>
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "다시 시도해 주세요");
    } finally {
      setLoading(false);
    }
  }

  function save(course: Course) {
    store.setSaved([
      { id: newId(), savedAt: new Date().toISOString(), area: area.trim(), hours, mood, budget, course },
      ...store.saved(),
    ]);
    setSavedTitles((t) => [...t, course.title]);
  }

  async function share(course: Course) {
    const text = [`[자유부인] ${course.title}`, ...course.steps.map((s) => `${s.start} ${s.activity}`)].join("\n");
    try {
      if (navigator.share) await navigator.share({ title: course.title, text });
      else {
        await navigator.clipboard.writeText(text);
        alert("복사했어요");
      }
    } catch {
      // 사용자가 공유를 취소한 경우
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">오늘은 자유부인 ♡</h1>

      <Question title="몇 시간?">
        <div className="grid grid-cols-5 gap-2">
          {HOURS.map((h) => (
            <Chip key={h} selected={hours === h} onClick={() => setHours(h)}>
              {h}시간
            </Chip>
          ))}
        </div>
      </Question>

      <Question title="오늘은?">
        <div className="grid grid-cols-2 gap-2">
          {MOOD_OPTIONS.map((m) => (
            <Chip key={m.value} big selected={mood === m.value} onClick={() => setMood(m.value)}>
              {m.label}
            </Chip>
          ))}
        </div>
      </Question>

      <Question title="예산은?">
        <div className="grid grid-cols-4 gap-2">
          {BUDGET_OPTIONS.map((b) => (
            <Chip key={b.value} selected={budget === b.value} onClick={() => setBudget(b.value)}>
              {b.label}
            </Chip>
          ))}
        </div>
      </Question>

      <Question title="어디서?">
        <input
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="망원동"
          maxLength={40}
          aria-label="동네"
          className="w-full rounded-2xl bg-card px-4 py-3.5 outline-none focus:ring-2 focus:ring-accent"
        />
      </Question>

      <div>
        {error && <p className="mb-2 text-center text-sm text-accent">{error}</p>}
        <button
          type="button"
          onClick={plan}
          disabled={loading}
          className="w-full rounded-2xl bg-accent py-4 text-lg font-bold text-white disabled:opacity-60"
        >
          {loading ? "짜는 중…" : "코스 짜줘"}
        </button>
      </div>

      {courses.length > 0 && (
        <section id="results" className="space-y-4">
          {courses.map((course, i) => {
            const saved = savedTitles.includes(course.title);
            return (
              <CourseCard
                key={i}
                course={course}
                actions={
                  <>
                    <button
                      type="button"
                      onClick={() => save(course)}
                      disabled={saved}
                      className="flex-1 rounded-xl bg-accent py-3 font-semibold text-white disabled:opacity-60"
                    >
                      {saved ? "저장됨 ✓" : "저장"}
                    </button>
                    <button
                      type="button"
                      onClick={() => share(course)}
                      className="rounded-xl bg-background px-5 py-3 font-semibold"
                    >
                      공유
                    </button>
                  </>
                }
              />
            );
          })}
          <button type="button" onClick={plan} disabled={loading} className="w-full py-3 text-muted">
            ↻ 다른 코스
          </button>
        </section>
      )}
    </div>
  );
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-bold">{title}</h2>
      {children}
    </section>
  );
}
