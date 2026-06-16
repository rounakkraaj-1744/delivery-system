import { Router } from "express";
import { getAllUsers } from "./user.controller.ts";
export const router = Router();

router.get ("/users", getAllUsers)