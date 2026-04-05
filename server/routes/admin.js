import express from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate, matchResultSchema } from "../src/validators.js";

const router = express.Router();

// Admin check middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Not authorized" });
  }
  next();
};

// Update Match Result
router.patch(
  "/matches/:id/result",
  authMiddleware,
  isAdmin,
  validate(matchResultSchema),
  async (req, res, next) => {
    try {
      const matchId = parseInt(req.params.id);
      if (isNaN(matchId)) {
        return res.status(400).json({ error: "Invalid match ID" });
      }

      const { homeScore, awayScore } = req.body;

      const updatedMatch = await prisma.match.update({
        where: { id: matchId },
        data: { homeScore, awayScore },
      });

      res.json(updatedMatch);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Match not found" });
      }
      next(error);
    }
  }
);

export default router;
