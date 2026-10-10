import { Suspense } from "react";
import SharedCourse from "@/components/SharedCourse";

export const metadata = {
  title: "자유부인 · 공유된 코스",
};

export default function SharedCoursePage() {
  return (
    <Suspense>
      <SharedCourse />
    </Suspense>
  );
}
