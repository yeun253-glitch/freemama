import { naverMapUrl, won, type Course } from "@/lib/course";

type Props = {
  course: Course;
  index?: number;
  actions?: React.ReactNode;
};

export default function CourseCard({ course, index, actions }: Props) {
  return (
    <article className="rounded-3xl border border-line bg-card p-6">
      {index !== undefined && (
        <p className="font-serif text-xs tracking-[0.2em] text-accent">COURSE {String(index + 1).padStart(2, "0")}</p>
      )}
      <h3 className="mt-1 font-serif text-xl">{course.title}</h3>
      <p className="mt-1 text-sm text-muted">예상 {won(course.total_cost)}</p>

      <ol className="mt-5 divide-y divide-line border-y border-line">
        {course.steps.map((step, i) => (
          <li key={i}>
            <a
              href={naverMapUrl(step.search)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 py-3"
            >
              <span className="w-11 shrink-0 text-sm tabular-nums text-muted">{step.start}</span>
              <span className="flex-1 text-[15px]">{step.activity}</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="1.4" aria-label="지도에서 보기">
                <path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11Z" />
                <circle cx="12" cy="10" r="2" />
              </svg>
            </a>
          </li>
        ))}
      </ol>

      {actions && <div className="mt-5 flex gap-2">{actions}</div>}
    </article>
  );
}
