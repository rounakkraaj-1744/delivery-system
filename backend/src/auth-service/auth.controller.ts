import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import type { AuthRequest } from "./auth.middleware.ts";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-default-key";

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const agentSendOtpSchema = z.object({
  phone: z.string().min(10),
});

const agentVerifyOtpSchema = z.object({
  phone: z.string().min(10),
  otp: z.string().length(4),
});

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = adminLoginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt,
      },
    });

    const token = jwt.sign(
      { userId: user.id, sessionId: session.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", user: { id: user.id, username: user.username, role: user.role, email: user.email } });
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input format" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const sendAgentOtp = async (req: Request, res: Response) => {
  try {
    const { phone } = agentSendOtpSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { phone } })
    res.status(200).json({ message: "OTP sent successfully" })
  } catch (error) {
    res.status(400).json({ error: "Invalid phone number format" })
  }
};

export const verifyAgentOtp = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = agentVerifyOtpSchema.parse(req.body);

    if (otp !== "1234") {
      res.status(401).json({ error: "Invalid OTP" });
      return;
    }

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          username: `agent_${phone.slice(-4)}`,
          role: "AGENT",
        }
      });
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); 
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt,
      },
    });

    const token = jwt.sign(
      { userId: user.id, sessionId: session.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", user: { id: user.id, username: user.username, role: user.role, phone: user.phone } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input format" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, email: true, phone: true, role: true }
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    if (req.sessionId) {
      await prisma.session.deleteMany({
        where: { id: req.sessionId }
      });
    }
    
    res.clearCookie("session_token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};