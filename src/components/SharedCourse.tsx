"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CourseCard from "@/components/CourseCard";
import { decodeCourse } from "@/lib/share";
import { newId, store } from "@/lib/storage";
import { track } from "@/lib/track";

export default function SharedCourse() {
  const params = useSearchParams();
  const course = useMemo(() => decodeCourse(params.get("d") ?? ""), [params]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (course) track("shared_course_opened", {});
  }, [course]);

  if (!course) {
    return (
      <div className="space-y-6 pt-10 text-center">
        <p className="font-serif text-xl">코스를 불러오지 못했어요</p>
        <Link href="/" className="text-accent underline underline-offset-4">
          나만의 코스 찾아보기
        </Link>
      </div>
    );
  }

  function save() {
    if (!course) return;
    store.setSaved([
      { id: newId(), savedAt: new Date().toISOString(), area: "", hours: 0, mood: "", budget: "", course },
      ...store.saved(),
    ]);
    setSaved(true);
    track("course_saved", { index: -1 });
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="font-serif text-sm tracking-[0.2em] text-accent">자유부인</p>
        <h1 className="mt-2 font-serif text-[26px] leading-snug">
          소중한 사람이
          <br />
          코스를 보내왔어요
        </h1>
      </header>

      <CourseCard
        course={course}
        actions={
          <button
            type="button"
            onClick={save}
            disabled={saved}
            className="flex-1 rounded-full bg-accent py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saved ? "보관함에 담았어요" : "보관함에 담기"}
          </button>
        }
      />

      <Link
        href="/"
        className="block rounded-full border border-accent py-4 text-center font-semibold text-accent"
      >
        나만의 코스 추천받기
      </Link>
    </div>
  );
}
