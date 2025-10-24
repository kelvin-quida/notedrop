interface SortSelectProps {
  value: 'newest' | 'oldest';
  onChange: (v: 'newest' | 'oldest') => void;
}

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as 'newest' | 'oldest')}
        className="appearance-none pr-6 pl-4 py-1.5 rounded-full bg-bg-secondary border border-border-primary text-text-secondary focus:outline-none focus:ring-2 focus:ring-button-primary text-sm cursor-pointer"
        aria-label="Ordenar mensagens"
      >
        <option value="newest">Mais recentes</option>
        <option value="oldest">Mais antigas</option>
      </select>
      <span className="pointer-events-none absolute right-2 text-text-muted">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </label>
  );
}
