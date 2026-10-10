"use client";

import { useEffect, useState } from "react";
import Chip from "@/components/Chip";
import CourseCard from "@/components/CourseCard";
import LoadingCourses from "@/components/LoadingCourses";
import type { Budget, Course, Mood } from "@/lib/course";
import { shareCourse } from "@/lib/share";
import { newId, store } from "@/lib/storage";
import { nextRequestCount, track } from "@/lib/track";

const HOURS = [2, 3, 4, 6, 8];

const MOOD_OPTIONS: { value: Mood; label: string }[] = [
  { value: "회복", label: "온전한 휴식" },
  { value: "재미", label: "설레는 하루" },
  { value: "성취", label: "새로운 배움" },
  { value: "혼자만의 시간", label: "나만의 시간" },
];

const BUDGET_OPTIONS: { value: Budget; label: string }[] = [
  { value: "0원", label: "무료" },
  { value: "3만원 이하", label: "3만원" },
  { value: "10만원 이하", label: "10만원" },
  { value: "상관없음", label: "마음껏" },
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
  const [sample, setSample] = useState(false);

  useEffect(() => setArea(store.lastArea()), []);

  async function plan() {
    if (!area.trim()) {
      setError("머무를 동네를 알려 주세요");
      return;
    }
    setError("");
    setLoading(true);
    setCourses([]);
    setSavedTitles([]);
    store.setLastArea(area.trim());
    track("course_requested", { nth: nextRequestCount(), hours, mood, budget });
    requestAnimationFrame(() =>
      document.getElementById("loading")?.scrollIntoView({ behavior: "smooth", block: "center" }),
    );

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
      setSample(Boolean(data.sample));
      requestAnimationFrame(() =>
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "다시 시도해 주세요");
    } finally {
      setLoading(false);
    }
  }

  function save(course: Course, index: number) {
    store.setSaved([
      { id: newId(), savedAt: new Date().toISOString(), area: area.trim(), hours, mood, budget, course },
      ...store.saved(),
    ]);
    setSavedTitles((t) => [...t, course.title]);
    track("course_saved", { index });
  }

  async function share(course: Course) {
    if (await shareCourse(course)) track("course_shared", { from: "results" });
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="font-serif text-sm tracking-[0.2em] text-accent">자유부인</p>
        <h1 className="mt-2 font-serif text-[26px] leading-snug">
          오늘은 어떤 하루를
          <br />
          보내고 싶으세요?
        </h1>
      </header>

      <Question title="주어진 시간">
        <div className="grid grid-cols-5 gap-2">
          {HOURS.map((h) => (
            <Chip key={h} selected={hours === h} onClick={() => setHours(h)}>
              {h}시간
            </Chip>
          ))}
        </div>
      </Question>

      <Question title="오늘의 기분">
        <div className="grid grid-cols-2 gap-2">
          {MOOD_OPTIONS.map((m) => (
            <Chip key={m.value} big selected={mood === m.value} onClick={() => setMood(m.value)}>
              {m.label}
            </Chip>
          ))}
        </div>
      </Question>

      <Question title="예산">
        <div className="grid grid-cols-4 gap-2">
          {BUDGET_OPTIONS.map((b) => (
            <Chip key={b.value} selected={budget === b.value} onClick={() => setBudget(b.value)}>
              {b.label}
            </Chip>
          ))}
        </div>
      </Question>

      <Question title="동네">
        <input
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="예) 성수동"
          maxLength={40}
          aria-label="동네"
          className="w-full rounded-full border border-line bg-card px-5 py-3.5 outline-none focus:border-accent"
        />
      </Question>

      <div>
        {error && <p className="mb-2 text-center text-sm text-accent">{error}</p>}
        <button
          type="button"
          onClick={plan}
          disabled={loading}
          className="w-full rounded-full bg-accent py-4 font-semibold tracking-wide text-white disabled:opacity-60"
        >
          {loading ? "당신만의 코스를 준비하고 있어요" : "나만의 코스 추천받기"}
        </button>
      </div>

      {loading && <LoadingCourses />}

      {courses.length > 0 && (
        <section id="results" className="space-y-4">
          {sample && <p className="text-center text-xs text-muted">지금은 예시 코스를 보여드리고 있어요</p>}
          {courses.map((course, i) => {
            const saved = savedTitles.includes(course.title);
            return (
              <CourseCard
                key={i}
                index={i}
                course={course}
                actions={
                  <>
                    <button
                      type="button"
                      onClick={() => save(course, i)}
                      disabled={saved}
                      className="flex-1 rounded-full bg-accent py-3 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {saved ? "보관함에 담았어요" : "보관함에 담기"}
                    </button>
                    <button
                      type="button"
                      onClick={() => share(course)}
                      className="rounded-full border border-line px-5 py-3 text-sm"
                    >
                      공유
                    </button>
                  </>
                }
              />
            );
          })}
          <button type="button" onClick={plan} disabled={loading} className="w-full py-3 text-sm text-muted underline underline-offset-4">
            다른 코스 보기
          </button>
        </section>
      )}
    </div>
  );
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-[13px] tracking-wide text-muted">{title}</h2>
      {children}
    </section>
  );
}
