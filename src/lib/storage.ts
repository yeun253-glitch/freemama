"use client";

import type { Course } from "./course";

export type SavedCourse = {
  id: string;
  savedAt: string;
  area: string;
  hours: number;
  mood: string;
  budget: string;
  course: Course;
  review?: Review;
};

export type Review = {
  rating: number;
  reviewedAt: string;
};

export type BucketItem = {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
};

const KEYS = {
  saved: "jayubuin.saved",
  bucket: "jayubuin.bucket",
  lastArea: "jayubuin.lastArea",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장 공간이 막힌 브라우저(사생활 보호 모드 등)에서는 조용히 넘어간다
  }
}

export function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const store = {
  saved: () => read<SavedCourse[]>(KEYS.saved, []),
  setSaved: (items: SavedCourse[]) => write(KEYS.saved, items),
  bucket: () => read<BucketItem[]>(KEYS.bucket, []),
  setBucket: (items: BucketItem[]) => write(KEYS.bucket, items),
  lastArea: () => read<string>(KEYS.lastArea, ""),
  setLastArea: (area: string) => write(KEYS.lastArea, area),
};
