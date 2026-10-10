import type { Course } from "./course";

// ANTHROPIC_API_KEY 없이 로컬에서 화면을 확인할 때 쓰는 예시 코스
export function sampleCourses(area: string): Course[] {
  return [
    {
      title: "햇살 드는 북카페의 오후",
      total_cost: 18000,
      steps: [
        { start: "13:00", minutes: 20, activity: "천천히 동네 산책", cost: 0, search: `${area} 산책로` },
        { start: "13:20", minutes: 100, activity: "창가 자리에서 책 한 권", cost: 9000, search: `${area} 북카페` },
        { start: "15:00", minutes: 40, activity: "작은 디저트 하나", cost: 9000, search: `${area} 디저트` },
        { start: "15:40", minutes: 20, activity: "귀가", cost: 0, search: `${area} 버스정류장` },
      ],
    },
    {
      title: "몸과 마음을 가볍게",
      total_cost: 27000,
      steps: [
        { start: "13:00", minutes: 60, activity: "요가 원데이 클래스", cost: 20000, search: `${area} 요가 원데이` },
        { start: "14:10", minutes: 60, activity: "포케 점심", cost: 7000, search: `${area} 포케` },
        { start: "15:10", minutes: 30, activity: "귀가", cost: 0, search: `${area} 지하철역` },
      ],
    },
    {
      title: "흙으로 빚는 나의 찻잔",
      total_cost: 30000,
      steps: [
        { start: "13:00", minutes: 120, activity: "도예 원데이 클래스", cost: 25000, search: `${area} 도예 원데이` },
        { start: "15:10", minutes: 30, activity: "조용한 카페에서 쉼", cost: 5000, search: `${area} 카페` },
        { start: "15:40", minutes: 20, activity: "귀가", cost: 0, search: `${area} 버스정류장` },
      ],
    },
  ];
}
