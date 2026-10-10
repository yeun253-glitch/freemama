"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import { BUDGETS, MOODS, type Budget, type Course, type Mood } from "@/lib/course";
import { newId, store } from "@/lib/storage";

const MOOD_EMOJI: Record<Mood, string> = {
  회복: "🌿",
  재미: "🎉",
  성취: "📚",
  "혼자만의 시간": "☕",
};

const BUDGET_LABEL: Record<Budget, string> = {
  "0원": "0원, 돈 안 쓰고",
  "3만원 이하": "3만원 이하",
  "10만원 이하": "10만원 이하",
  상관없음: "오늘은 나에게 투자!",
};

export default function Planner() {
  const [hours, setHours] = useState(4);
  const [mood, setMood] = useState<Mood>("회복");
  const [budget, setBudget] = useState<Budget>("3만원 이하");
  const [area, setArea] = useState("");
  const [useBucket, setUseBucket] = useState(true);
  const [bucketCount, setBucketCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [savedTitles, setSavedTitles] = useState<string[]>([]);

  useEffect(() => {
    setArea(store.lastArea());
    setBucketCount(store.bucket().filter((b) => !b.done).length);
  }, []);

  async function plan() {
    if (!area.trim()) {
      setError("어느 동네 근처에서 놀지 알려 주세요.");
      return;
    }
    setError("");
    setLoading(true);
    setCourses([]);
    setSavedTitles([]);
    store.setLastArea(area.trim());

    const bucket = useBucket
      ? store
          .bucket()
          .filter((b) => !b.done)
          .map((b) => b.text)
      : [];

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours, mood, budget, area: area.trim(), bucket, now: new Date().toISOString() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "다시 시도해 주세요.");
      setCourses(data.courses);
      requestAnimationFrame(() =>
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "다시 시도해 주세요.");
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
    const text = [
      `[자유부인] ${course.title}`,
      course.concept,
      ...course.steps.map((s) => `${s.start} ${s.activity}`),
    ].join("\n");
    try {
      if (navigator.share) await navigator.share({ title: course.title, text });
      else {
        await navigator.clipboard.writeText(text);
        alert("코스를 복사했어요. 카톡에 붙여 넣어 보세요!");
      }
    } catch {
      // 사용자가 공유를 취소한 경우
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs tracking-widest text-muted">FREEDOM DAY</p>
        <h1 className="mt-1 text-2xl font-bold">오늘은 자유부인 ♡</h1>
        <p className="mt-1 text-sm text-muted">오늘의 자유, 어떻게 보내고 싶어?</p>
      </header>

      <section className="space-y-5 rounded-2xl border border-line bg-card p-4 shadow-sm">
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="hours" className="text-sm font-semibold">
              나에게 주어진 자유 시간
            </label>
            <span className="text-xs text-muted">이동 시간 포함</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-accent">{hours}시간</p>
          <input
            id="hours"
            type="range"
            min={1}
            max={10}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--accent)]"
          />
        </div>

        <div>
          <p className="text-sm font-semibold">오늘 나에게 필요한 건?</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {MOODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={`rounded-xl border px-3 py-3 text-sm ${
                  mood === m ? "border-accent bg-accent-soft font-semibold" : "border-line"
                }`}
              >
                <span className="mr-1">{MOOD_EMOJI[m]}</span>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">오늘의 예산</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {BUDGETS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBudget(b)}
                className={`rounded-xl border px-3 py-2.5 text-sm ${
                  budget === b ? "border-accent bg-accent-soft font-semibold" : "border-line"
                }`}
              >
                {BUDGET_LABEL[b]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="area" className="text-sm font-semibold">
            어디 근처에서?
          </label>
          <input
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="예: 망원동, 판교역"
            maxLength={40}
            className="mt-2 w-full rounded-xl border border-line bg-transparent px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useBucket}
            onChange={(e) => setUseBucket(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          버킷리스트도 섞어 주세요 <span className="text-muted">({bucketCount}개)</span>
        </label>

        {error && <p className="text-sm text-accent">{error}</p>}

        <button
          type="button"
          onClick={plan}
          disabled={loading}
          className="w-full rounded-xl bg-accent py-3.5 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "코스 짜는 중이에요…" : "나만의 자유 코스 만들기 →"}
        </button>
      </section>

      {courses.length > 0 && (
        <section id="results" className="space-y-3">
          <h2 className="text-lg font-bold">오늘의 코스 3개</h2>
          {courses.map((course, i) => {
            const saved = savedTitles.includes(course.title);
            return (
              <CourseCard
                key={i}
                course={course}
                defaultOpen={i === 0}
                actions={
                  <>
                    <button
                      type="button"
                      onClick={() => save(course)}
                      disabled={saved}
                      className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {saved ? "저장했어요 ✓" : "이 코스로 갈래요"}
                    </button>
                    <button
                      type="button"
                      onClick={() => share(course)}
                      className="rounded-xl border border-line px-4 py-2.5 text-sm"
                    >
                      공유
                    </button>
                  </>
                }
              />
            );
          })}
          <button
            type="button"
            onClick={plan}
            disabled={loading}
            className="w-full rounded-xl border border-line py-3 text-sm"
          >
            다른 코스 보기
          </button>
        </section>
      )}
    </div>
  );
}
