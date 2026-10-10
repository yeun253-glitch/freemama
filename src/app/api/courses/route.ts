import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { NextResponse } from "next/server";
import { CoursesResponseSchema, PlanRequestSchema, type PlanRequest } from "@/lib/course";
import { sampleCourses } from "@/lib/sample";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.CLAUDE_MODEL ?? "claude-haiku-5-5";
const DAILY_LIMIT_PER_IP = Number(process.env.DAILY_LIMIT_PER_IP ?? 20);

let client: Anthropic | null = null;

// 서버 인스턴스 하나 안에서만 유지되는 간단한 하루 호출 제한 (비용 폭주 방지용)
const usage = new Map<string, { day: string; count: number }>();

function overLimit(ip: string) {
  const day = new Date().toISOString().slice(0, 10);
  const entry = usage.get(ip);
  if (!entry || entry.day !== day) {
    usage.set(ip, { day, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > DAILY_LIMIT_PER_IP;
}

const SYSTEM = `너는 "자유부인" 앱의 코스 플래너다. 육아 중인 엄마가 아이를 맡기고 어렵게 얻은 자유 시간을 후회 없이 쓰도록, 바로 실행할 수 있는 코스를 짜 준다.

규칙:
- 코스는 정확히 3개. 성격이 서로 달라야 한다: 하나는 차분한, 하나는 활동적인, 하나는 새로운 경험.
- 코스당 단계는 3~4개. 마지막 단계는 "귀가".
- 각 코스의 단계 시간(이동 포함) 합계는 주어진 자유 시간을 넘지 않는다. 마지막 20~30분은 귀가 이동으로 남긴다.
- 총비용은 예산을 넘지 않는다. "0원"이면 모든 단계가 무료여야 한다.
- 실제 가게나 브랜드 이름을 지어내지 않는다. 활동 유형과 네이버지도 검색어만 제시한다. 검색어에는 사용자가 말한 지역을 넣는다.
- 요일과 시각을 고려한다. 늦은 밤에는 문을 닫는 활동을 넣지 않는다.
- 버킷리스트가 주어지면, 조건에 맞는 항목을 적어도 한 코스에 자연스럽게 넣는다.
- 톤은 여성 라이프스타일 매거진처럼 우아하고 산뜻하게. 유행어, 반말, 느낌표, 이모지는 쓰지 않는다.
- 글은 짧게. 제목은 14자 이내의 감성적인 명사구 (예: "햇살 드는 북카페의 오후", "향기로 채우는 시간"). 활동 이름은 15자 이내 명사형 (예: "창가 자리에서 책 한 권").
- 비용은 한국 물가 기준의 현실적인 원 단위 추정치로 쓴다.`;

function buildPrompt(req: PlanRequest) {
  const now = new Date(req.now);
  const kst = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  const lines = [
    `지금: ${kst} (한국 시간)`,
    `자유 시간: ${req.hours}시간 (이동 포함)`,
    `오늘 필요한 것: ${req.mood}`,
    `예산: ${req.budget}`,
    `지역: ${req.area} 근처`,
  ];
  if (req.bucket.length > 0) {
    lines.push(`버킷리스트: ${req.bucket.map((b) => `"${b}"`).join(", ")}`);
  }
  lines.push("", "지금 바로 출발한다고 생각하고 코스 3개를 짜 줘.");
  return lines.join("\n");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = PlanRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "입력값을 다시 확인해 주세요." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (overLimit(ip)) {
    return NextResponse.json(
      { error: "오늘은 추천을 많이 받으셨어요. 내일 다시 만나요!" },
      { status: 429 },
    );
  }

  // API 키를 넣기 전에도 화면을 시험해 볼 수 있도록 예시 코스를 돌려준다
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ courses: sampleCourses(parsed.data.area), sample: true });
  }

  try {
    client ??= new Anthropic();
    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 8000,
      system: SYSTEM,
      output_config: { effort: "low", format: zodOutputFormat(CoursesResponseSchema) },
      messages: [{ role: "user", content: buildPrompt(parsed.data) }],
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return NextResponse.json(
        { error: "코스를 만들지 못했어요. 조건을 조금 바꿔서 다시 시도해 주세요." },
        { status: 502 },
      );
    }

    return NextResponse.json({ courses: response.parsed_output.courses.slice(0, 3) });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "지금 요청이 몰려 있어요. 잠시 후 다시 시도해 주세요." },
        { status: 503 },
      );
    }
    if (error instanceof Anthropic.APIError) {
      console.error("Claude API error", error.status, error.message);
    } else {
      console.error("Unexpected error", error);
    }
    return NextResponse.json(
      { error: "잠시 문제가 생겼어요. 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
