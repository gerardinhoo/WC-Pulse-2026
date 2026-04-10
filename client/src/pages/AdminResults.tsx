import { useEffect, useState } from "react";
import api from "../api/axios";

type Match = {
  id: number;
  date: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
  homeScore: number | null;
  awayScore: number | null;
};

type ScoreInput = { homeScore: string; awayScore: string };

export default function AdminResults() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<Record<number, ScoreInput>>({});
  const [submitting, setSubmitting] = useState<number | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get("/matches");
        setMatches(res.data.data);

        // Pre-fill inputs for matches that already have results
        const existing: Record<number, ScoreInput> = {};
        for (const m of res.data.data) {
          if (m.homeScore !== null && m.awayScore !== null) {
            existing[m.id] = {
              homeScore: String(m.homeScore),
              awayScore: String(m.awayScore),
            };
          }
        }
        setScores(existing);
      } catch (err) {
        console.error("Failed to fetch matches");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleChange = (matchId: number, field: keyof ScoreInput, value: string) => {
    setScores((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (matchId: number) => {
    const s = scores[matchId];

    // Check for undefined/empty string, NOT falsy (so "0" is valid)
    if (s?.homeScore === undefined || s?.homeScore === "" ||
        s?.awayScore === undefined || s?.awayScore === "") {
      alert("Enter both scores");
      return;
    }

    setSubmitting(matchId);

    try {
      await api.patch(`/admin/matches/${matchId}/result`, {
        homeScore: Number(s.homeScore),
        awayScore: Number(s.awayScore),
      });

      // Update the match in local state so UI reflects the change immediately
      setMatches((prev) =>
        prev.map((m) =>
          m.id === matchId
            ? { ...m, homeScore: Number(s.homeScore), awayScore: Number(s.awayScore) }
            : m
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update result");
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return <div className="p-6">Loading matches...</div>;

  // Show unplayed matches first, then played
  const unplayed = matches.filter((m) => m.homeScore === null);
  const played = matches.filter((m) => m.homeScore !== null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin — Set Match Results</h1>

      {unplayed.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-3">Pending Results</h2>
          <div className="space-y-3 mb-8">
            {unplayed.map((match) => (
              <div
                key={match.id}
                className="p-4 border rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {match.homeTeam.name} vs {match.awayTeam.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(match.date).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="0"
                    placeholder="H"
                    className="w-14 p-1 border rounded text-center"
                    value={scores[match.id]?.homeScore || ""}
                    onChange={(e) => handleChange(match.id, "homeScore", e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="A"
                    className="w-14 p-1 border rounded text-center"
                    value={scores[match.id]?.awayScore || ""}
                    onChange={(e) => handleChange(match.id, "awayScore", e.target.value)}
                  />
                  <button
                    onClick={() => handleSubmit(match.id)}
                    disabled={submitting === match.id}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    {submitting === match.id ? "Saving..." : "Set"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {played.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-3">Completed</h2>
          <div className="space-y-3">
            {played.map((match) => (
              <div
                key={match.id}
                className="p-4 border rounded flex justify-between items-center bg-gray-50"
              >
                <div>
                  <p className="font-semibold">
                    {match.homeTeam.name} vs {match.awayTeam.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(match.date).toLocaleString()}
                  </p>
                </div>
                <p className="font-bold text-lg">
                  {match.homeScore} - {match.awayScore}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
