import express from "express";
import { prisma } from "../lib/prisma.js";
import { calculatePoints } from "../src/services/leaderboard.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        prediction: {
          include: {
            match: true
          }
        }
      }
    });

    const leaderboard = users.map(user => {
      let totalPoints = 0;

      user.prediction.forEach(pred => {
        totalPoints += calculatePoints(pred, pred.match);
      });

      return {
        userId: user.id,
        email: user.email,
        points: totalPoints
      };
    });

    // sort descending
    leaderboard.sort((a, b) => b.points - a.points);

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
});

export default router;