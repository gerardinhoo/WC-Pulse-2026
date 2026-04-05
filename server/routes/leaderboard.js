import express from "express";
import { prisma } from "../lib/prisma.js";
import { calculatePoints } from "../src/services/leaderboard.js";
import { paginationSchema } from "../src/validators.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);

    // Only load predictions for matches that have results (avoids useless data)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
        prediction: {
          where: {
            match: { homeScore: { not: null }, awayScore: { not: null } },
          },
          include: { match: true },
        },
      },
    });

    const leaderboard = users
      .map((user) => {
        let totalPoints = 0;
        for (const pred of user.prediction) {
          totalPoints += calculatePoints(pred, pred.match);
        }

        return {
          userId: user.id,
          displayName: user.displayName || "Anonymous",
          points: totalPoints,
        };
      })
      .sort((a, b) => b.points - a.points);

    // Paginate the sorted results
    const total = leaderboard.length;
    const paginated = leaderboard.slice((page - 1) * limit, page * limit);

    // Add rank based on position in the full sorted list
    const offset = (page - 1) * limit;
    const ranked = paginated.map((entry, i) => ({
      rank: offset + i + 1,
      ...entry,
    }));

    res.json({
      data: ranked,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
