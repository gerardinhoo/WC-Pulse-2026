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

type PredictionInput = { homeScore: string; awayScore: string; saved?: boolean };

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<Record<number, PredictionInput>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchesRes, predictionsRes] = await Promise.all([
          api.get("/matches"),
          api.get("/predictions/my").catch(() => null),
        ]);

        setMatches(matchesRes.data.data);

        // Pre-fill inputs with existing predictions
        if (predictionsRes?.data?.data) {
          const saved: Record<number, PredictionInput> = {};
          for (const p of predictionsRes.data.data) {
            saved[p.matchId] = {
              homeScore: String(p.homeScore),
              awayScore: String(p.awayScore),
              saved: true,
            };
          }
          setPredictions(saved);
        }
      } catch (err) {
        console.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (matchId: number, field: "homeScore" | "awayScore", value: string) => {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value,
        saved: false,
      },
    }));
  };

  const handleSubmit = async (matchId: number) => {
    const prediction = predictions[matchId];

    if (!prediction?.homeScore || !prediction?.awayScore) {
      alert("Enter both scores");
      return;
    }

    try {
      await api.post("/predictions", {
        matchId,
        homeScore: Number(prediction.homeScore),
        awayScore: Number(prediction.awayScore),
      });

      setPredictions((prev) => ({
        ...prev,
        [matchId]: { ...prev[matchId], saved: true },
      }));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to submit");
    }
  };

  if (loading) return <div>Loading matches...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Matches</h1>

      <div className="space-y-4">
        {matches.map((match) => {
          const pred = predictions[match.id];
          const hasResult = match.homeScore !== null && match.awayScore !== null;

          return (
            <div
              key={match.id}
              className="p-4 border rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(match.date).toLocaleString()}
                </p>
                {pred?.saved && !hasResult && (
                  <p className="text-xs text-green-600 mt-1">
                    Your prediction: {pred.homeScore} - {pred.awayScore}
                  </p>
                )}
              </div>

              <div>
                {hasResult ? (
                  <p className="font-bold">
                    {match.homeScore} - {match.awayScore}
                  </p>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="H"
                      className="w-14 p-1 border rounded text-center"
                      value={pred?.homeScore || ""}
                      onChange={(e) =>
                        handleChange(match.id, "homeScore", e.target.value)
                      }
                    />
                    <span>-</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="A"
                      className="w-14 p-1 border rounded text-center"
                      value={pred?.awayScore || ""}
                      onChange={(e) =>
                        handleChange(match.id, "awayScore", e.target.value)
                      }
                    />
                    <button
                      onClick={() => handleSubmit(match.id)}
                      className={`px-2 py-1 rounded text-white ${
                        pred?.saved
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      {pred?.saved ? "Update" : "Submit"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
