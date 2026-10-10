import type { Course } from "./course";

// ANTHROPIC_API_KEY 없이 로컬에서 화면을 확인할 때 쓰는 예시 코스
export function sampleCourses(area: string): Course[] {
  return [
    {
      title: "책 한 권의 오후",
      emoji: "📖",
      total_cost: 18000,
      steps: [
        { start: "13:00", minutes: 20, activity: "동네 산책", cost: 0, search: `${area} 산책로` },
        { start: "13:20", minutes: 100, activity: "북카페에서 책 한 권", cost: 9000, search: `${area} 북카페` },
        { start: "15:00", minutes: 40, activity: "디저트 테이크아웃", cost: 9000, search: `${area} 디저트` },
        { start: "15:40", minutes: 20, activity: "귀가", cost: 0, search: `${area} 버스정류장` },
      ],
    },
    {
      title: "땀 흘리고 개운하게",
      emoji: "🧘",
      total_cost: 27000,
      steps: [
        { start: "13:00", minutes: 60, activity: "요가 원데이 클래스", cost: 20000, search: `${area} 요가 원데이` },
        { start: "14:10", minutes: 60, activity: "포케 점심", cost: 7000, search: `${area} 포케` },
        { start: "15:10", minutes: 30, activity: "귀가", cost: 0, search: `${area} 지하철역` },
      ],
    },
    {
      title: "처음 해보는 도예",
      emoji: "🏺",
      total_cost: 30000,
      steps: [
        { start: "13:00", minutes: 120, activity: "도예 원데이 클래스", cost: 25000, search: `${area} 도예 원데이` },
        { start: "15:10", minutes: 30, activity: "근처 카페", cost: 5000, search: `${area} 카페` },
        { start: "15:40", minutes: 20, activity: "귀가", cost: 0, search: `${area} 버스정류장` },
      ],
    },
  ];
}
