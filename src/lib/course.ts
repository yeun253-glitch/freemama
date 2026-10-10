import { z } from "zod";

export const MOODS = ["회복", "재미", "성취", "혼자만의 시간"] as const;
export const BUDGETS = ["0원", "3만원 이하", "10만원 이하", "상관없음"] as const;

export type Mood = (typeof MOODS)[number];
export type Budget = (typeof BUDGETS)[number];

export const PlanRequestSchema = z.object({
  hours: z.number().int().min(1).max(10),
  mood: z.enum(MOODS),
  budget: z.enum(BUDGETS),
  area: z.string().trim().min(1).max(40),
  bucket: z.array(z.string().trim().max(100)).max(20).default([]),
  now: z.string().datetime({ offset: true }),
});

export type PlanRequest = z.infer<typeof PlanRequestSchema>;

export const StepSchema = z.object({
  start: z.string().describe("HH:MM, 24시간제"),
  minutes: z.number().describe("이 단계에 쓰는 시간(분), 이동 포함"),
  activity: z.string().describe("15자 이내의 짧은 활동 이름. 실제 가게 이름은 쓰지 않는다"),
  cost: z.number().describe("예상 비용(원)"),
  search: z.string().describe("네이버지도에서 검색할 검색어, 예: 망원동 도예 원데이"),
});

export const CourseSchema = z.object({
  title: z.string().describe("14자 이내 제목"),
  total_cost: z.number().describe("총 예상 비용(원)"),
  steps: z.array(StepSchema),
});

export const CoursesResponseSchema = z.object({
  courses: z.array(CourseSchema),
});

export type Step = z.infer<typeof StepSchema>;
export type Course = z.infer<typeof CourseSchema>;

export function won(n: number) {
  return n === 0 ? "0원" : `${Math.round(n).toLocaleString("ko-KR")}원`;
}

export function naverMapUrl(query: string) {
  return `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
}
