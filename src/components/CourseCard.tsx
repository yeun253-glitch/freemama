import { naverMapUrl, won, type Course } from "@/lib/course";

type Props = {
  course: Course;
  actions?: React.ReactNode;
};

export default function CourseCard({ course, actions }: Props) {
  return (
    <article className="rounded-3xl bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          {course.emoji}
        </span>
        <div className="flex-1">
          <h3 className="text-lg font-bold">{course.title}</h3>
          <p className="text-sm text-muted">{won(course.total_cost)}</p>
        </div>
      </div>

      <ol className="mt-4 space-y-2">
        {course.steps.map((step, i) => (
          <li key={i}>
            <a
              href={naverMapUrl(step.search)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl bg-background px-3 py-2.5"
            >
              <span className="w-11 shrink-0 text-sm text-muted">{step.start}</span>
              <span className="flex-1">{step.activity}</span>
              <span aria-label="지도에서 찾기">📍</span>
            </a>
          </li>
        ))}
      </ol>

      {actions && <div className="mt-4 flex gap-2">{actions}</div>}
    </article>
  );
}
