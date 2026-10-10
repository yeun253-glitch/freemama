type Props = {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  big?: boolean;
};

export default function Chip({ selected, onClick, children, big = false }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border transition ${big ? "py-3.5 text-[15px]" : "py-2.5 text-sm"} ${
        selected
          ? "border-accent bg-accent-soft font-semibold text-accent"
          : "border-line bg-card text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
