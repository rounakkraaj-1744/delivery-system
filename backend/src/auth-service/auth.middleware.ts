import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.ts";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
  sessionId?: string;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.session_token;

    if (!token) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return;
    }

    const secret = process.env.JWT_SECRET || "super-secret-default-key";
    const decoded = jwt.verify(token, secret) as { userId: string; sessionId: string; role: string };

    const session = await prisma.session.findUnique({
      where: { id: decoded.sessionId },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } });
      }
      res.clearCookie("session_token");
      res.status(401).json({ error: "Unauthorized: Session expired or invalid" });
      return;
    }

    req.user = { id: decoded.userId, role: decoded.role };
    req.sessionId = decoded.sessionId;

    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};