import server from "./server.js";
import dotenv from "dotenv"
import {connectDB} from "./config/db.js";
// import { sendEmail } from "./services/mail.service.js";

dotenv.config({path:"./.env"})

const port = process.env.PORT || 3000

;connectDB()
        .then(async()=>{
            server.listen(port,()=>{
                console.log(`Server is running on port ${port}`);
            })
        })
        .catch((err)=>{
            console.log("Failed to connect to DB", err);
        })