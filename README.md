# 자유부인

어렵게 얻은 자유 시간, 후회 없이 쓰는 코스를 1분 만에 추천해 주는 모바일 웹앱.

자유 시간(시간)·기분·예산·지역을 입력하면 Claude가 성격이 다른 코스 3개를 짜 주고,
마음에 드는 코스를 저장하고, 다녀온 뒤 만족도를 기록할 수 있다.

## 기능 (MVP)

- **오늘의 자유**: 시간 / 기분 / 예산 / 지역 → 코스 3개 (시간표, 단계별 비용, 네이버지도 검색 링크)
- **저장한 코스**: 저장, 삭제, "다녀왔어요" 별점
- **버킷리스트**: 하고 싶은 것을 적어 두면 추천에 섞어 줌
- 홈 화면에 추가 가능한 PWA

저장 데이터는 지금은 브라우저(localStorage)에만 남는다. 기기 간 동기화는 Supabase 연결 단계에서 붙인다.

## 실행

```bash
npm install
cp .env.example .env.local   # ANTHROPIC_API_KEY 입력
npm run dev                  # http://localhost:3000
```

## 배포 (Vercel)

1. Vercel에서 이 저장소를 Import
2. Environment Variables에 `ANTHROPIC_API_KEY` 추가 (선택: `CLAUDE_MODEL`, `DAILY_LIMIT_PER_IP`)
3. Deploy

## 구조

| 경로 | 내용 |
| --- | --- |
| `src/app/api/courses/route.ts` | 코스 추천 API (Claude 구조화 출력) |
| `src/lib/course.ts` | 입력/코스 스키마 (zod) |
| `src/lib/storage.ts` | 저장·버킷리스트 로컬 저장소 |
| `src/components/Planner.tsx` | 입력 화면 + 결과 |
| `src/app/saved`, `src/app/bucket` | 저장한 코스, 버킷리스트 |
