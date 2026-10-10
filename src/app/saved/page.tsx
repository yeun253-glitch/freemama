"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import { won } from "@/lib/course";
import { store, type SavedCourse } from "@/lib/storage";

export default function SavedPage() {
  const [items, setItems] = useState<SavedCourse[]>([]);
  const [reviewing, setReviewing] = useState<string | null>(null);

  useEffect(() => setItems(store.saved()), []);

  function update(next: SavedCourse[]) {
    setItems(next);
    store.setSaved(next);
  }

  function remove(id: string) {
    if (confirm("이 코스를 삭제할까요?")) update(items.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">저장한 코스</h1>
        <p className="mt-1 text-sm text-muted">다녀오면 후기를 남겨 주세요. 다음 추천이 더 정확해져요.</p>
      </header>

      {items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
          아직 저장한 코스가 없어요.
          <br />
          <Link href="/" className="mt-2 inline-block text-accent underline">
            오늘의 코스 만들러 가기
          </Link>
        </div>
      )}

      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <p className="px-1 text-xs text-muted">
            {new Date(item.savedAt).toLocaleDateString("ko-KR")} · {item.area} · {item.hours}시간 · {item.mood}
          </p>
          <CourseCard
            course={item.course}
            actions={
              item.review ? (
                <div className="w-full rounded-xl bg-accent-soft px-3 py-2 text-sm">
                  {"★".repeat(item.review.rating)}
                  {"☆".repeat(5 - item.review.rating)} · 실제 {won(item.review.actualCost)}
                  {item.review.memo && <p className="mt-1 text-muted">{item.review.memo}</p>}
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setReviewing(item.id)}
                    className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white"
                  >
                    다녀왔어요
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="rounded-xl border border-line px-4 py-2.5 text-sm"
                  >
                    삭제
                  </button>
                </>
              )
            }
          />
          {reviewing === item.id && (
            <ReviewForm
              defaultCost={item.course.total_cost}
              onCancel={() => setReviewing(null)}
              onSubmit={(review) => {
                update(items.map((i) => (i.id === item.id ? { ...i, review } : i)));
                setReviewing(null);
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ReviewForm({
  defaultCost,
  onSubmit,
  onCancel,
}: {
  defaultCost: number;
  onSubmit: (review: NonNullable<SavedCourse["review"]>) => void;
  onCancel: () => void;
}) {
  const [rating, setRating] = useState(4);
  const [cost, setCost] = useState(String(defaultCost));
  const [memo, setMemo] = useState("");

  return (
    <div className="space-y-3 rounded-2xl border border-accent bg-card p-4">
      <p className="text-sm font-semibold">오늘 자유 시간, 어땠어요?</p>
      <div className="flex gap-1 text-2xl text-accent">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n}점`}>
            {n <= rating ? "★" : "☆"}
          </button>
        ))}
      </div>
      <label className="block text-sm">
        실제로 쓴 돈 (원)
        <input
          inputMode="numeric"
          value={cost}
          onChange={(e) => setCost(e.target.value.replace(/[^0-9]/g, ""))}
          className="mt-1 w-full rounded-xl border border-line bg-transparent px-3 py-2 outline-none focus:border-accent"
        />
      </label>
      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="한 줄 메모 (예: 도예 너무 좋았음, 카페는 사람 많았음)"
        maxLength={200}
        rows={2}
        className="w-full rounded-xl border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() =>
            onSubmit({ rating, actualCost: Number(cost || 0), memo: memo.trim(), reviewedAt: new Date().toISOString() })
          }
          className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white"
        >
          후기 저장
        </button>
        <button type="button" onClick={onCancel} className="rounded-xl border border-line px-4 py-2.5 text-sm">
          취소
        </button>
      </div>
    </div>
  );
}
