import { z } from "zod";

export const ACTIVITIES = ["맛집", "쉼", "뷰티", "문화", "쇼핑", "클래스"] as const;
export const BUDGETS = ["0원", "5만원 이하", "10만원 이하", "상관없음"] as const;

export type Activity = (typeof ACTIVITIES)[number];
export type Budget = (typeof BUDGETS)[number];

// 화면 이름, 그리고 추천 프롬프트에 들어가는 활동 설명과 보통 걸리는 시간
export const ACTIVITY_INFO: Record<Activity, { label: string; guide: string }> = {
  맛집: { label: "맛있는 한 끼", guide: "브런치, 맛집, 디저트. 식사는 1시간 안팎" },
  쉼: { label: "조용한 쉼", guide: "조용한 카페, 산책, 책 읽기, 낮잠. 카페는 1~2시간" },
  뷰티: { label: "나를 가꾸는 시간", guide: "미용실, 네일, 마사지, 스파. 네일 1시간, 마사지 1~1.5시간, 미용실 1.5~2시간" },
  문화: { label: "영화·전시", guide: "영화, 전시, 공연. 영화 2시간 반, 전시 1~1.5시간" },
  쇼핑: { label: "쇼핑", guide: "옷, 화장품, 소품, 꽃 구경과 구매. 1~2시간" },
  클래스: { label: "원데이 클래스", guide: "공방, 쿠킹, 요가·필라테스 같은 원데이 클래스. 1.5~2시간" },
};

export const PlanRequestSchema = z.object({
  hours: z.number().int().min(1).max(10),
  activities: z.array(z.enum(ACTIVITIES)).min(1).max(3),
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
