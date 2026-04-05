import express from "express";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { group } = req.query;

    const teams = await prisma.team.findMany({
      where: group ? { group } : {},
      orderBy: { group: "asc" },
    });

    res.json(teams);
  } catch (error) {
    next(error);
  }
});

export default router;
