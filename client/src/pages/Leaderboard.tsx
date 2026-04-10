import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

type LeaderboardEntry = {
  rank: number;
  userId: number;
  displayName: string;
  points: number;
};

const RANK_STYLES: Record<number, string> = {
  1: "text-yellow-500",
  2: "text-gray-400",
  3: "text-amber-600",
};

const RANK_LABELS: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/leaderboard");
        setLeaders(res.data.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="p-6">Loading leaderboard...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>

      <div className="max-w-xl mx-auto">
        {leaders.length === 0 ? (
          <p className="text-gray-500 text-center">
            No predictions scored yet. Check back once match results are in!
          </p>
        ) : (
          leaders.map((player) => {
            const isCurrentUser = user?.id === player.userId;

            return (
              <div
                key={player.userId}
                className={`flex justify-between items-center p-4 border rounded mb-2 ${
                  isCurrentUser
                    ? "bg-blue-50 border-blue-400 ring-1 ring-blue-300"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-lg w-8 ${RANK_STYLES[player.rank] || ""}`}>
                    {RANK_LABELS[player.rank] || `#${player.rank}`}
                  </span>
                  <span>
                    {player.displayName}
                    {isCurrentUser && (
                      <span className="text-xs text-blue-500 ml-2">(you)</span>
                    )}
                  </span>
                </div>

                <span className="font-semibold">{player.points} pts</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
