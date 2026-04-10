import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
      <h1 className="text-6xl font-bold text-[var(--color-accent)] mb-4">404</h1>
      <p className="text-[var(--color-text-muted)] mb-6">
        This page doesn't exist.
      </p>
      <Link
        to="/"
        className="px-4 py-2 rounded-md bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
