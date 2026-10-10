"use client";

import { useEffect, useState } from "react";
import Chip from "@/components/Chip";
import CourseCard from "@/components/CourseCard";
import LoadingCourses from "@/components/LoadingCourses";
import { ACTIVITIES, ACTIVITY_INFO, type Activity, type Budget, type Course } from "@/lib/course";
import { shareCourse } from "@/lib/share";
import { newId, store } from "@/lib/storage";
import { nextRequestCount, track } from "@/lib/track";

const MAX_ACTIVITIES = 3;

// 시간 바를 움직일 때 함께 보여 주는, 그 시간에 들어가는 일의 예
function hoursHint(h: number) {
  if (h <= 1) return "카페 한 잔, 짧은 산책";
  if (h === 2) return "식사 한 끼, 네일 케어 하나";
  if (h === 3) return "식사와 카페, 또는 영화 한 편";
  if (h === 4) return "클래스와 식사, 또는 마사지와 카페";
  if (h <= 6) return "두세 곳을 여유 있게";
  if (h < 10) return "반나절 나들이";
  return "하루를 온전히 나에게";
}

const BUDGET_OPTIONS: { value: Budget; label: string }[] = [
  { value: "0원", label: "무료" },
  { value: "5만원 이하", label: "5만원" },
  { value: "10만원 이하", label: "10만원" },
  { value: "상관없음", label: "마음껏" },
];

export default function Planner() {
  const [hours, setHours] = useState(4);
  const [activities, setActivities] = useState<Activity[]>(["쉼"]);
  const [budget, setBudget] = useState<Budget>("5만원 이하");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [savedTitles, setSavedTitles] = useState<string[]>([]);
  const [sample, setSample] = useState(false);

  useEffect(() => setArea(store.lastArea()), []);

  const mood = activities.map((a) => ACTIVITY_INFO[a].label).join(", ");

  function toggleActivity(a: Activity) {
    setActivities((cur) => {
      if (cur.includes(a)) return cur.length > 1 ? cur.filter((x) => x !== a) : cur;
      return cur.length < MAX_ACTIVITIES ? [...cur, a] : [...cur.slice(1), a];
    });
  }

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
        body: JSON.stringify({ hours, activities, budget, area: area.trim(), bucket, now: new Date().toISOString() }),
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
        <div className="rounded-3xl border border-line bg-card px-5 py-4">
          <div className="flex items-baseline justify-between">
            <p className="font-serif text-2xl text-accent">{hours >= 10 ? "종일" : `${hours}시간`}</p>
            <p className="text-xs text-muted">{hoursHint(hours)}</p>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            aria-label="주어진 시간"
            className="mt-3 w-full accent-[var(--accent)]"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted">
            <span>1시간</span>
            <span>5시간</span>
            <span>종일</span>
          </div>
        </div>
      </Question>

      <Question title="하고 싶은 것" note="세 가지까지">
        <div className="grid grid-cols-2 gap-2">
          {ACTIVITIES.map((a) => (
            <Chip key={a} big selected={activities.includes(a)} onClick={() => toggleActivity(a)}>
              {ACTIVITY_INFO[a].label}
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

      <div className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[5]">
        {error && <p className="mb-2 text-center text-sm text-accent">{error}</p>}
        <button
          type="button"
          onClick={plan}
          disabled={loading}
          className="w-full rounded-full bg-accent py-4 font-semibold tracking-wide text-white shadow-lg shadow-accent/20 disabled:opacity-60"
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

function Question({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-[13px] tracking-wide text-muted">
        {title}
        {note && <span className="ml-2 text-[11px] opacity-70">{note}</span>}
      </h2>
      {children}
    </section>
  );
}
