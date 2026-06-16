import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";

export async function getAllUsers (req: Request, res: Response) {
    const users = await prisma.user.findMany();

    res.status(200).json ({
        users
    })
}
