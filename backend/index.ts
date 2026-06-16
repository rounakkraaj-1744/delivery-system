import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { router as userRoutes } from "./src/user-service/user.route.ts"
import { router as orderRoutes } from "./src/order-service/order.route.ts"
import { router as authRoutes } from "./src/auth-service/auth.route.ts"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use(authRoutes)
app.use(userRoutes)
app.use(orderRoutes)

const port = process.env.PORT || 8080;

app.get ("/", (req, res)=>{
    res.send ("Backend is running fine")
})

app.listen (port, ()=>{
     console.log (`Server started at : http://localhost:${port}`)
})