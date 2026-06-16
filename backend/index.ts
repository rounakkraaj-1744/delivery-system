import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { router as userRoutes } from "./src/user-service/user.route.ts"
import { router as orderRoutes } from "./src/order-service/order.route.ts"

dotenv.config()

const app = express()

app.use (cors())
app.use (express.json())
app.use (userRoutes)
app.use (orderRoutes)

const port = process.env.PORT || 8080;

app.get ("/", (req, res)=>{
    res.send ("Backend is running fine")
})

app.listen (port, ()=>{
     console.log (`Server started at : http://localhost:${port}`)
})