import type { Course } from "./course";

// ANTHROPIC_API_KEY 없이 로컬에서 화면을 확인할 때 쓰는 예시 코스
export function sampleCourses(area: string): Course[] {
  return [
    {
      title: "카페에서 나를 채우는 오후",
      concept: "아무것도 안 해도 되는, 진짜 쉬는 시간",
      vibe: "차분한",
      total_cost: 18000,
      steps: [
        { start: "13:00", minutes: 20, activity: "동네 산책", detail: "휴대폰은 가방에 넣고 천천히 걸어요.", cost: 0, search: `${area} 산책로` },
        { start: "13:20", minutes: 100, activity: "북카페에서 책 한 권", detail: "창가 자리에서 읽고 싶던 책을 펴 보세요.", cost: 9000, search: `${area} 북카페` },
        { start: "15:00", minutes: 40, activity: "디저트 테이크아웃", detail: "집에 가져갈 작은 선물도 하나.", cost: 9000, search: `${area} 디저트` },
        { start: "15:40", minutes: 20, activity: "귀가", detail: "여유 있게 돌아가요.", cost: 0, search: `${area} 버스정류장` },
      ],
      tip: "책은 미리 골라 두면 고민 시간이 줄어요.",
    },
    {
      title: "땀 흘리고 개운하게",
      concept: "몸을 움직여서 머리를 비우는 코스",
      vibe: "활동적인",
      total_cost: 27000,
      steps: [
        { start: "13:00", minutes: 60, activity: "요가 원데이 클래스", detail: "초보자 클래스로 가볍게 시작해요.", cost: 20000, search: `${area} 요가 원데이` },
        { start: "14:10", minutes: 60, activity: "건강한 점심", detail: "샐러드나 포케로 든든하게.", cost: 7000, search: `${area} 포케` },
        { start: "15:10", minutes: 30, activity: "귀가", detail: "개운한 몸으로 돌아가요.", cost: 0, search: `${area} 지하철역` },
      ],
      tip: "운동복은 미리 입고 나가면 시간이 절약돼요.",
    },
    {
      title: "처음 해보는 도예 데이트",
      concept: "나랑 하는 새로운 경험",
      vibe: "새로운 경험",
      total_cost: 30000,
      steps: [
        { start: "13:00", minutes: 120, activity: "도예 원데이 클래스", detail: "내가 쓸 컵 하나를 직접 만들어요.", cost: 25000, search: `${area} 도예 원데이` },
        { start: "15:10", minutes: 30, activity: "근처 카페", detail: "만든 컵 사진 정리하며 한숨 돌리기.", cost: 5000, search: `${area} 카페` },
        { start: "15:40", minutes: 20, activity: "귀가", detail: "완성품은 몇 주 뒤에 받아요.", cost: 0, search: `${area} 버스정류장` },
      ],
      tip: "원데이 클래스는 주말에 빨리 차니 미리 예약해요.",
    },
  ];
}
