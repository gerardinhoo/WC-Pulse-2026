import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";
import { JWT_SECRET } from "../src/config.js";
import { validate, registerSchema, loginSchema } from "../src/validators.js";

const router = express.Router();

// REGISTER
router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    console.log("Register request:", req.body);
    const { email, password, displayName } = req.body;

    console.log("Parsed:", { displayName, email, password });


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        displayName,
      },
    });

    res.status(201).json({ message: "User created", userId: user.id });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "User already exists" });
    }
    next(error);
  }
});

// LOGIN
router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
});

// Protected Route
router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, displayName: true, role: true },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
