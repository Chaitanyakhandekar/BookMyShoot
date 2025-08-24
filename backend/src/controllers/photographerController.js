import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import {Photographer} from "../models/photographer.model.js"
import { generateAccessAndRefreshTokenP } from "../utils/generateARTokenP.js"

const registerPhotographer = asyncHandler(async (req, res,next) => {
    const {
      
        fullName,
        phone,
        location,
        specialization,
        experience,
        email,
        password
    } = req.body

    if ([fullName, phone, location, specialization, experience, email, password].some((field) => (!field || field.trim() === ""))) {
        throw new ApiError(400, "All Fields are required!")
    }

    if (password.length < 8) {
        throw new ApiError(400, "Password must be atleast 8 charachers long.")
    }

    const alreadyExists = await Photographer.findOne({ email });

    if (alreadyExists) {
        throw new ApiError(400, "Photographer with this email already exists.")
    }

    const newPhotographer = await Photographer.create({
        fullName,
        phone,
        location,
        specialization,
        experience,
        email,
        password
    })

    if (!newPhotographer) {
        throw new ApiError(500, "Photographer Creation Error")
    }

    req.newPhotographer = newPhotographer;

    return res
    .status(201).json(
         new ApiResponse(201, "Photographer registered successfully", newPhotographer)
    )

})


const loginPhotographer = asyncHandler(async (req,res)=>{
   // ALGORITHM : {  
   // req.body -> data
   // validate data
   // check user exists in database with username or email
   // if not exists then throw error
   // if exists then check password 
   // generate accessToken and refreshToken 
   // store refreshToken in database
   // send accessToken in httpOnly and secure cookie  or (in response body if using mobile application)
   // send success message or response}


   const {email,username,password} = req.body

   if(!username && !email){
      throw new ApiError(400 , "username and email is required!")
   }

   const photographer = await Photographer.findOne({
      $or: [{username},{email}]
   })

   if(!photographer){
      throw new ApiError(401, "User with give data doesnt exists")
   }

   if(!password){
      throw new ApiError(400,"password is required!")
   }

   const isValidPassword = await photographer.isCorrectPassword(password)

   if(!isValidPassword){
      throw new ApiError(401,"Invalid user credantials")
   }

   const {accessToken , refreshToken} = await generateAccessAndRefreshTokenP(photographer._id)

   const options = {
      httpOnly:true,
      secure:true,
      sameSite:process.env.NODE_ENV === "production" ? "none" : "lax"
   }

   return res
      .status(200)
      .cookie("accessToken" , accessToken , options)
      .cookie("refreshToken", refreshToken , options)
      .json(
         new ApiResponse(200, {
            id: photographer._id,
            username: photographer.username,
            email: photographer.email,
         },"Login Successful")
      )
})

const logoutPhotographer = asyncHandler(async (req,res)=>{
   // Algorithm : {
   // req.user -> data
   // clear cookies
   // clear refreshToken from database
   // send success response}

   const options = {
      httpOnly:true,
      secure:true,
      sameSite:process.env.NODE_ENV === "production" ? "none" : "lax"
   }

   const photographer = await Photographer.findById(req.photographer._id)
   photographer.refreshToken = ""
   await photographer.save({validateBeforeSave:false})

   return res
            .status(200)
            .clearCookie("accessToken",options)
            .clearCookie("refreshToken",options)
            .json(
               new ApiResponse(200,{},"Logout succesfull")
            )
})


export {
  registerPhotographer,
  loginPhotographer,
  logoutPhotographer
}