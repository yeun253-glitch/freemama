"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import { store, type SavedCourse } from "@/lib/storage";

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
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">저장</h1>

      {items.length === 0 && (
        <Link href="/" className="block rounded-3xl bg-card p-10 text-center text-muted">
          아직 없어요
          <br />
          <span className="mt-2 inline-block font-semibold text-accent">코스 짜러 가기 →</span>
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
                  className="flex-1 rounded-xl bg-accent py-3 font-semibold text-white"
                >
                  다녀왔어요
                </button>
                <button
                  type="button"
                  onClick={() => confirm("삭제할까요?") && update(items.filter((i) => i.id !== item.id))}
                  className="rounded-xl bg-background px-5 py-3 font-semibold"
                >
                  삭제
                </button>
              </>
            )
          }
        />
      ))}
    </div>
  );
}
