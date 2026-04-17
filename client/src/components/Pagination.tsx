type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  const goPrev = () => {
    if (!isFirst) onPageChange(page - 1);
  };

  const goNext = () => {
    if (!isLast) onPageChange(page + 1);
  };

  const btnBase =
    "px-4 py-2 rounded-md text-sm font-medium border border-[var(--color-border)] transition-colors";
  const btnEnabled =
    "text-[var(--color-text-muted)] hover:text-white hover:border-[var(--color-accent)]";
  const btnDisabled = "opacity-40 cursor-not-allowed";

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-between gap-3 mt-6 ${className}`}
    >
      <button
        type="button"
        onClick={goPrev}
        disabled={isFirst}
        aria-label="Previous page"
        className={`${btnBase} ${isFirst ? btnDisabled : btnEnabled}`}
      >
        ← Previous
      </button>

      <span
        className="text-sm text-[var(--color-text-muted)]"
        aria-live="polite"
      >
        Page <span className="text-white font-medium">{page}</span> of{" "}
        <span className="text-white font-medium">{totalPages}</span>
      </span>

      <button
        type="button"
        onClick={goNext}
        disabled={isLast}
        aria-label="Next page"
        className={`${btnBase} ${isLast ? btnDisabled : btnEnabled}`}
      >
        Next →
      </button>
    </nav>
  );
}
