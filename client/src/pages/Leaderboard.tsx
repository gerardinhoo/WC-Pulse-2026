import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";

type LeaderboardEntry = {
  rank: number;
  userId: number;
  displayName: string;
  points: number;
};

const RANK_LABELS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

const RANK_BG: Record<number, string> = {
  1: "border-yellow-500/30 bg-yellow-500/5",
  2: "border-gray-400/30 bg-gray-400/5",
  3: "border-amber-600/30 bg-amber-600/5",
};

const PAGE_SIZE = 20;

function parsePage(value: string | null): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;
}

export default function Leaderboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePage(searchParams.get("page"));

  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await api.get("/leaderboard", {
          params: { page, limit: PAGE_SIZE },
        });
        setLeaders(res.data.data);
        setTotalPages(res.data.meta?.totalPages ?? 1);
      } catch {
        console.error("Failed to fetch leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Clamp out-of-range ?page=N back to the last valid page.
  useEffect(() => {
    if (!loading && page > totalPages) {
      const next = new URLSearchParams(searchParams);
      if (totalPages > 1) next.set("page", String(totalPages));
      else next.delete("page");
      setSearchParams(next, { replace: true });
    }
  }, [loading, page, totalPages, searchParams, setSearchParams]);

  const handlePageChange = (next: number) => {
    const params = new URLSearchParams(searchParams);
    if (next <= 1) params.delete("page");
    else params.set("page", String(next));
    setSearchParams(params);
  };

  if (loading) return <Spinner />;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>

      <div className="max-w-xl mx-auto">
        {leaders.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-3xl mb-3">⚽</p>
            <p className="text-[var(--color-text-muted)]">
              No predictions scored yet. Check back once match results are in!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2 stagger-children">
              {leaders.map((player) => {
                const isCurrentUser = user?.id === player.userId;
                const isTop3 = player.rank <= 3;

                return (
                  <div
                    key={player.userId}
                    className={`card flex justify-between items-center ${
                      isCurrentUser
                        ? "ring-1 ring-[var(--color-accent)] border-[var(--color-accent)]/40"
                        : isTop3
                          ? RANK_BG[player.rank]
                          : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg w-8 text-center">
                        {RANK_LABELS[player.rank] || `#${player.rank}`}
                      </span>
                      <span className="font-medium">
                        {player.displayName}
                        {isCurrentUser && (
                          <span className="text-xs text-[var(--color-accent)] ml-2">(you)</span>
                        )}
                      </span>
                    </div>

                    <span className="font-bold text-[var(--color-accent)] tabular-nums">
                      {player.points} pts
                    </span>
                  </div>
                );
              })}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
