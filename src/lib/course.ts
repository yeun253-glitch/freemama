import { z } from "zod";

export const MOODS = ["휴식", "케어", "배움", "나들이", "쇼핑"] as const;
export const BUDGETS = ["0원", "5만원 이하", "10만원 이하", "상관없음"] as const;

// 기분 유형마다 어떤 활동으로 코스를 채우는지 (추천 프롬프트에 그대로 들어감)
export const MOOD_GUIDE: Record<(typeof MOODS)[number], string> = {
  휴식: "아무것도 하지 않고 쉬기. 조용한 카페, 산책, 공원 벤치, 낮잠, 책 읽기처럼 정적인 활동",
  케어: "몸과 마음 돌보기. 마사지, 스파, 사우나, 네일, 헤어, 피부 관리처럼 나를 가꾸는 활동",
  배움: "무언가 배우고 만들기. 원데이 클래스, 공방, 쿠킹 클래스, 강연, 서점 탐방",
  나들이: "좋은 곳 다녀오기. 전시, 맛집, 분위기 좋은 카페, 전망 좋은 곳, 동네 명소",
  쇼핑: "나를 위해 사기. 편집숍, 소품숍, 옷, 화장품, 꽃, 빈티지숍 구경과 구매",
};

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
