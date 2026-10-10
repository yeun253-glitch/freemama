import { CourseSchema, type Course } from "./course";

// 코스를 URL에 담아 서버 저장 없이 공유한다
export function encodeCourse(course: Course) {
  const bytes = new TextEncoder().encode(JSON.stringify(course));
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeCourse(encoded: string): Course | null {
  try {
    const binary = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const parsed = CourseSchema.safeParse(JSON.parse(new TextDecoder().decode(bytes)));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function shareUrl(course: Course) {
  return `${window.location.origin}/c?d=${encodeCourse(course)}`;
}

export async function shareCourse(course: Course) {
  const url = shareUrl(course);
  const text = `${course.title}\n${course.steps.map((s) => `${s.start} ${s.activity}`).join("\n")}`;
  try {
    if (navigator.share) {
      await navigator.share({ title: `자유부인 · ${course.title}`, text, url });
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      alert("코스 링크를 복사했어요");
    }
    return true;
  } catch {
    return false; // 사용자가 공유를 취소한 경우
  }
}
