"use client";

import { track as vercelTrack } from "@vercel/analytics";

type Event =
  | { name: "course_requested"; props: { nth: number; hours: number; mood: string; budget: string } }
  | { name: "course_saved"; props: { index: number } }
  | { name: "course_shared"; props: { from: string } }
  | { name: "shared_course_opened"; props: Record<string, never> }
  | { name: "course_rated"; props: { rating: number } };

// 출시 후 볼 지표: 추천 받은 사람, 저장 비율, 두 번째 추천 비율
export function track<E extends Event>(name: E["name"], props: E["props"]) {
  try {
    vercelTrack(name, props);
  } catch {
    // 분석 실패는 사용자 경험에 영향을 주지 않는다
  }
}

const COUNT_KEY = "jayubuin.requestCount";

export function nextRequestCount() {
  try {
    const n = Number(localStorage.getItem(COUNT_KEY) ?? 0) + 1;
    localStorage.setItem(COUNT_KEY, String(n));
    return n;
  } catch {
    return 1;
  }
}
