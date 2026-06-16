import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts"

export async function createOrder(req: Request, res: Response){
    const {
         orderNumber,
         customer,
         customerId,
         agent,
         agentId,
         pickupAddress,
         dropAddress,
         status,
    } = req.body;

    if (!req.body){
        return res.status(400).send ("Did not receive anything")
    }

    try {
        const order = await prisma.order.create ({
            data: {
                orderNumber,
                customer,
                customerId,
                agent,
                agentId,
                pickupAddress,
                dropAddress,
                status
            }
        })

        return res.status(201).json({
            message: "Order created successfully",
            order
        })
    } catch (error) {
         console.log (error)
    }
}