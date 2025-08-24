import { Photographer } from "../models/photographer.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "./apiError.js"

export const generateAccessAndRefreshTokenP = async (userId)=>{

    const photographer = await Photographer.findById(userId)

    if(!photographer){
        throw new ApiError(500,"error while generating access and refresh tokens")
    }

    const accessToken = await photographer.generateAccessToken()
    const refreshToken = await photographer.generateRefreshToken()

    photographer.refreshToken = refreshToken

    await photographer.save({validateBeforeSave:false})         // DB operation so use await

    return {accessToken,refreshToken}
}