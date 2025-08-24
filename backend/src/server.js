import express, { urlencoded } from 'express';
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config({
    path:"./.env"
})

const server = express()

server.use(cors({
    origin:[
        process.env.ALLOW_ORIGIN || "http://localhost:5173",
        "https://bookmyshoot.onrender.com"
    ],
    credentials:true
}))

server.use(express.json({limit:"16kb"}))
server.use(cookieParser())
server.use(express.urlencoded({extended:true,limit:"16kb"}))
server.use(express.static("public"))



import testRouter from "./routes/test.route.js"
import userRouter from "./routes/user.route.js";

server.use("/api/v1/users" , userRouter)

server.use("/api/v1/tests" , testRouter)

export default server;
