"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import { store, type SavedCourse } from "@/lib/storage";
import { track } from "@/lib/track";

export default function SavedPage() {
  const [items, setItems] = useState<SavedCourse[]>([]);
  const [rating, setRating] = useState<string | null>(null);

  useEffect(() => setItems(store.saved()), []);

  function update(next: SavedCourse[]) {
    setItems(next);
    store.setSaved(next);
  }

  function rate(id: string, stars: number) {
    update(items.map((i) => (i.id === id ? { ...i, review: { rating: stars, reviewedAt: new Date().toISOString() } } : i)));
    setRating(null);
    track("course_rated", { rating: stars });
  }

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-[26px]">보관함</h1>

      {items.length === 0 && (
        <Link href="/" className="block rounded-3xl border border-line bg-card p-10 text-center text-sm text-muted">
          아직 담아둔 코스가 없어요
          <br />
          <span className="mt-3 inline-block text-accent underline underline-offset-4">오늘의 코스 찾아보기</span>
        </Link>
      )}

      {items.map((item) => (
        <CourseCard
          key={item.id}
          course={item.course}
          actions={
            item.review ? (
              <p className="w-full text-center text-2xl text-accent" aria-label={`${item.review.rating}점`}>
                {"★".repeat(item.review.rating)}
                {"☆".repeat(5 - item.review.rating)}
              </p>
            ) : rating === item.id ? (
              <div className="flex w-full justify-center gap-2 text-3xl text-accent">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => rate(item.id, n)} aria-label={`${n}점`}>
                    ☆
                  </button>
                ))}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setRating(item.id)}
                  className="flex-1 rounded-full bg-accent py-3 text-sm font-semibold text-white"
                >
                  다녀왔어요
                </button>
                <button
                  type="button"
                  onClick={() => confirm("이 코스를 보관함에서 지울까요?") && update(items.filter((i) => i.id !== item.id))}
                  className="rounded-full border border-line px-5 py-3 text-sm"
                >
                  지우기
                </button>
              </>
            )
          }
        />
      ))}
    </div>
  );
}
