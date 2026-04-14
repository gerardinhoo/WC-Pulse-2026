import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";



type TeamStanding = {
  position: number
  teamId: number
  name: string
  MP: number
  W: number
  D: number
  L: number
  GF: number
  GA: number
  GD: number
  Pts: number
}

type Group = {
  name: string
}

export default function GroupsPage() {
  const { groupId } = useParams()
  const navigate = useNavigate()

  const [groups, setGroups] = useState<string[]>([])
  const [standings, setStandings] = useState<TeamStanding[]>([])

  const selectedGroup = groupId || "A"

  useEffect(() => {
    let ignore = false;

    const loadGroups = async () => {
      try {
        const res = await api.get<Group[]>("/groups");
        if (!ignore) {
          setGroups(res.data.map((g) => g.name));
        }
      } catch (error) {
        console.error("Failed to fetch groups", error);
      }
    };

    void loadGroups();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadStandings = async () => {
      try {
        const res = await api.get<TeamStanding[]>(`/groups/${selectedGroup}`);
        if (!ignore) {
          setStandings(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch standings", error);
      }
    };

    void loadStandings();

    return () => {
      ignore = true;
    };
  }, [selectedGroup]);


  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Group Standings</h1>

      {/* GROUP SELECTOR */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-8">
        {groups.map(g => (
          <button
            key={g}
            onClick={() => navigate(`/groups/${g}`)}
            className={`
            relative px-4 py-3 rounded-xl font-semibold
            transition-all duration-300
            border border-white/10
            backdrop-blur-md
            ${
                selectedGroup === g
                ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg scale-105"
                : "bg-gray-800/70 hover:bg-gray-700/80 hover:scale-105"
            }
            `}
        >
            Group {g}
        </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
        <div className="max-w-4xl mx-auto">
           <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <motion.tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Team</th>
              <th>MP</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GF</th>
              <th>GA</th>
              <th>GD</th>
              <th>Pts</th>
            </motion.tr>
          </thead>

          <tbody>
            {standings.map(team => (
              <tr
                key={team.teamId}
                className={`border-t border-gray-800 transition ${
                  team.position <= 2
                    ? "bg-green-900/30"
                    : "hover:bg-gray-800"
                }`}
              >
                <td className="p-3 font-bold">{team.position}</td>
                <td className="p-3">{team.name}</td>
                <td>{team.MP}</td>
                <td>{team.W}</td>
                <td>{team.D}</td>
                <td>{team.L}</td>
                <td>{team.GF}</td>
                <td>{team.GA}</td>
                <td>{team.GD}</td>
                <td className="font-bold">{team.Pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}