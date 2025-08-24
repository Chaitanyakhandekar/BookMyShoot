import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";
import { sendEmail } from "./mail.service.js";

dotenv.config({path:"./.env"});

export const sendVerificationToken = asyncHandler(async(req,res)=>{
    try {
        const user = req.newUser;
        const token = user.generateVerificationToken()

        const userWithToken = await User.findByIdAndUpdate(
            user._id,
            {
                $set:{
                    verificationToken:token,
                    verificationTokenExpiry:"15m"
                }
            },
            {
                new:true
            }
        )

        if(!userWithToken){
            throw new ApiError(500,"Token Creation Error")
        }

        console.log("Verification Token:", userWithToken);

        const emailResponse = await sendEmail(
            userWithToken.email,
            "DevMark Account Verification",
            `Click on the link to verify your account: <a href="https://bookmyshoot.onrender.com/verify/${userWithToken.verificationToken}">Verify Account</a>`,
           `<p>Click on the link to verify your account: <a href="https://bookmyshoot.onrender.com/verify/${userWithToken.verificationToken}">Verify Account</a></p>`
        )

        if(!emailResponse.success){
            throw new ApiError(500,"Email Sending Failed")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200,"Verification Token Send On Registered Email")
        )

    } catch (error) {
        console.log("Error in generateVerificationToken:", error);
        return error.message
    }
})