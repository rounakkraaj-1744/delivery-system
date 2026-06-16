import { Router } from "express";
import { createOrder } from "./order.controller.ts";
export const router = Router()

router.post ("/order", createOrder)