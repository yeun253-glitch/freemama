import type { Course, Mood } from "./course";

// ANTHROPIC_API_KEY 없이 화면을 확인할 때 쓰는 예시 코스 (기분 유형별 3개)
type Draft = { title: string; steps: [activity: string, minutes: number, cost: number, search: string][] };

const DRAFTS: Record<Mood, Draft[]> = {
  휴식: [
    { title: "햇살 드는 북카페의 오후", steps: [["창가 자리에서 책 한 권", 100, 9000, "북카페"], ["작은 디저트 하나", 40, 9000, "디저트"]] },
    { title: "초록 그늘 아래 산책", steps: [["숲길 천천히 걷기", 60, 0, "공원 산책로"], ["벤치에서 쉬어 가기", 40, 0, "공원"]] },
    { title: "아무것도 하지 않을 자유", steps: [["조용한 찻집에서 차 한 잔", 90, 12000, "찻집"], ["동네 한 바퀴", 30, 0, "산책"]] },
  ],
  케어: [
    { title: "온몸이 풀리는 시간", steps: [["전신 아로마 마사지", 90, 70000, "아로마 마사지"], ["따뜻한 허브티", 30, 6000, "티룸"]] },
    { title: "손끝까지 단정하게", steps: [["젤 네일 케어", 80, 45000, "네일샵"], ["카페에서 쉬어 가기", 40, 6000, "카페"]] },
    { title: "땀 흘리고 개운하게", steps: [["찜질과 사우나", 120, 15000, "찜질방"], ["식혜 한 잔", 20, 3000, "찜질방"]] },
  ],
  배움: [
    { title: "흙으로 빚는 나의 찻잔", steps: [["도예 원데이 클래스", 120, 45000, "도예 원데이"], ["조용한 카페에서 쉼", 30, 6000, "카페"]] },
    { title: "향기로 채우는 시간", steps: [["향수 만들기 클래스", 90, 50000, "향수 공방"], ["서점 구경", 40, 0, "독립서점"]] },
    { title: "오늘의 한 접시", steps: [["쿠킹 원데이 클래스", 120, 55000, "쿠킹 클래스"], ["만든 요리로 점심", 20, 0, "쿠킹 클래스"]] },
  ],
  나들이: [
    { title: "그림 앞에 머무는 오후", steps: [["전시 관람", 90, 15000, "전시회"], ["뮤지엄 카페에서 쉼", 40, 8000, "갤러리 카페"]] },
    { title: "줄 서도 아깝지 않은 한 끼", steps: [["소문난 브런치", 80, 25000, "브런치 맛집"], ["골목 구경", 40, 0, "골목 명소"]] },
    { title: "노을이 예쁜 자리", steps: [["전망 좋은 루프탑 카페", 80, 12000, "루프탑 카페"], ["강변 산책", 40, 0, "산책로"]] },
  ],
  쇼핑: [
    { title: "취향을 담은 작은 소품", steps: [["소품숍 둘러보기", 80, 30000, "소품샵"], ["카페에서 쉬어 가기", 40, 6000, "카페"]] },
    { title: "나를 위한 한 벌", steps: [["편집숍에서 옷 고르기", 100, 60000, "편집숍"], ["디저트 한 조각", 30, 8000, "디저트"]] },
    { title: "꽃 한 다발의 기쁨", steps: [["꽃집에서 꽃다발 고르기", 40, 30000, "꽃집"], ["빈티지숍 구경", 60, 15000, "빈티지샵"]] },
  ],
};

function hhmm(minutesFrom13: number) {
  const t = 13 * 60 + minutesFrom13;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

export function sampleCourses(area: string, mood: Mood): Course[] {
  return DRAFTS[mood].map(({ title, steps }) => {
    let elapsed = 0;
    const built = [...steps, ["귀가", 30, 0, "지하철역"] as const].map(([activity, minutes, cost, search]) => {
      const step = { start: hhmm(elapsed), minutes, activity, cost, search: `${area} ${search}` };
      elapsed += minutes;
      return step;
    });
    return { title, total_cost: built.reduce((sum, s) => sum + s.cost, 0), steps: built };
  });
}
