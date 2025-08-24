import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken"
import { Photographer } from "../models/photographer.model.js";

export const verifyJWTPhotographer = asyncHandler(async (req,res,next)=>{

    const accessToken = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ","")
    console.log("Access Token from Cookie/Header:", accessToken);

    if(!accessToken){
        throw new ApiError(401,"Unauthorized Request")
    } 

    let decodedToken;

    try {
         decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
         console.log("Decoded Token:", decodedToken);
    } catch (error) {
        throw new ApiError(401,"invalid or expired Access token")
    }

    const photographer = await Photographer.findById(decodedToken.id).select("-password -refreshToken")

    if(!photographer){
        throw new ApiError(401,"Invalid Access Token")
    }

    req.photographer = photographer
    next()
})