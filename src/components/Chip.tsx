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
      className={`rounded-2xl font-semibold transition ${big ? "py-4 text-base" : "py-3 text-sm"} ${
        selected ? "bg-accent text-white" : "bg-card text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
