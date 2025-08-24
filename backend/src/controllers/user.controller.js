import {asyncHandler} from '../utils/asyncHandler.js'

import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { User } from '../models/user.model.js'
import {uploadFileOnCloudinary} from '../utils/cloudinary.js'
import {generateAccessAndRefreshToken} from "../utils/generateARTokens.js"
import jwt from "jsonwebtoken"
// import { cookieOptions } from '../constants.js'
import mongoose from 'mongoose'

const registerUser = asyncHandler(async (req, res,next) => {
    const {
        username,
        fullName,
        email,
        password
    } = req.body

    if ([username, fullName, email, password].some((field) => (!field || field.trim() === ""))) {
        throw new ApiError(400, "All Fields are required!")
    }

    if (password.length < 8) {
        throw new ApiError(400, "Password must be atleast 8 charachers long.")
    }

    const alreadyExists = await User.findOne({ email });

    if (alreadyExists) {
        throw new ApiError(400, "User with this email already exists.")
    }

    const newUser = await User.create({
        username,
        fullName,
        email,
        password
    })

    if (!newUser) {
        throw new ApiError(500, "User Creation Error")
    }

    
    req.newUser = newUser;

    return res
    .status(201).json(
         new ApiResponse(201, "User registered successfully", newUser)
    )

})

const verifyUser = asyncHandler(async (req, res) => {
    const { token } = req.params;

    if (!token || token.trim() === "") {
        throw new ApiError(400, "Token is required for verification")
    }

    let decodeToken;

    try {
        decodeToken = jwt.verify(
            token,
            process.env.VERIFICATION_SECRET
        )

        if (!decodeToken) {
            throw new ApiError(400, "Invalid or Expired Token")
        }

        const user = await User.findByIdAndUpdate(
            decodeToken.id,
            {
                $set: {
                    isVerified: true
                }
            },
            {
                new: true
            }
        )

        if (!user) {
            throw new ApiError(404, "User Not Found")
        }

        return res.status(200).send(`
            <h1>Verification Successful</h1>
            <p>Your account has been verified successfully!</p>
        `)
    } catch (error) {
        return res.status(500).send(`
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verification Successful</title>
  <style>
    body {
      background-color: #0d1117;
      color: #c9d1d9;
      font-family: "Fira Code", monospace;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }

    .container {
      background: #161b22;
      padding: 2rem 3rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      text-align: center;
      max-width: 500px;
      border: 1px solid #30363d;
    }

    .check-icon {
      font-size: 4rem;
      color: #3fb950;
      animation: pop 0.4s ease-in-out;
    }

    @keyframes pop {
      0% { transform: scale(0.5); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    h1 {
      margin: 1rem 0 0.5rem;
      font-size: 1.8rem;
      color: #58a6ff;
    }

    p {
      font-size: 1rem;
      line-height: 1.5;
      color: #8b949e;
    }

    .button {
      margin-top: 1.5rem;
      text-decoration: none;
      background: #238636;
      color: white;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      font-weight: 500;
      transition: background 0.2s ease;
      display: inline-block;
    }

    .button:hover {
      background: #2ea043;
    }

    footer {
      margin-top: 2rem;
      font-size: 0.8rem;
      color: #6e7681;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="check-icon">✅</div>
    <h1>Verification Successful</h1>
    <p>Your token has been verified successfully. You can now proceed to access secured resources.</p>
    <a href="/" class="button">Continue</a>
  </div>
  <footer>© 2025 Developer Portal</footer>
</body>
</html>
`)
    }
})


const isVerifiedUser = asyncHandler(async (req,res)=>{
  const {email} = req.params;

  const user = await User.findOne({email});

  if (!user) {
      throw new ApiError(404, "User Not Found");
  }

  if (!user.isVerified) {
      throw new ApiError(403, "User is not verified");
  }

  return res.status(200).json({
    isVerified: user.isVerified,
  })
})



const loginUser = asyncHandler(async (req,res)=>{
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

   const user = await User.findOne({
      $or: [{username},{email}]
   })

   if(!user){
      throw new ApiError(401, "User with give data doesnt exists")
   }

   if(!password){
      throw new ApiError(400,"password is required!")
   }

   const isValidPassword = await user.isCorrectPassword(password)

   if(!isValidPassword){
      throw new ApiError(401,"Invalid user credantials")
   }

   const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)

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
            id: user._id,
            username: user.username,
            email: user.email,
         },"Login Successful")
      )
})

const logoutUser = asyncHandler(async (req,res)=>{
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

   const user = await User.findById(req.user._id)
   user.refreshToken = ""
   await user.save({validateBeforeSave:false})

   return res
            .status(200)
            .clearCookie("accessToken",options)
            .clearCookie("refreshToken",options)
            .json(
               new ApiResponse(200,{},"Logout succesfull")
            )
})

const refreshAccessToken = asyncHandler(async (req,res)=>{

   const incomingRefreshToken = req.cookies?.refreshToken

   if(!incomingRefreshToken){
      throw new ApiError(401,"Unauthorized request")
   }

   let decodedToken;

    try {
      decodedToken = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
         throw new ApiError(401,"Refresh Token Expired or used")
    }

   const user = await User.findById(decodedToken._id)

   if(!user){
      throw new ApiError(500,"User not found! ")
   }

   const {accessToken , newRefreshToken} = await generateAccessAndRefreshToken(user._id)

   return res.status(200)
             .cookie("accessToken",accessToken,cookieOptions)
             .cookie("refreshToken",newRefreshToken,cookieOptions)
             .json(
               new ApiResponse(200,
                  {
                     _id:user._id,
                     username:user.username,
                     email:user.email,
                     accessToken,
                  },
                  "AccessToken refreshed"
               )
             )
})

const changeCurrentPassword = asyncHandler(async (req,res)=>{     // used verifyJWT middleware

   const {currentPassword , newPassword} = req.body

   if(!(currentPassword && newPassword )){
      throw new ApiError(400,"All fields are required!")
   }

   const user = await User.findById(req.user?._id)

   const isCorrect = await user?.isCorrectPassword(currentPassword)

   if(!isCorrect){
      throw new ApiError(401,"Enter correct password to change password")
   }

   user.password = newPassword
   await user.save({validateBeforeSave:false})

   //!  EXTRA : FOR MORE SECURITY PURPOSE

   //const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)

   return res
            .status(200)
            // .cookie("accessToken",accessToken,cookieOptions)      // new accessToken
            // .cookie("refreshToken",refreshToken,cookieOptions)    // new refreshToken
            .json(
               new ApiResponse(200,{},"Password updated succesfully")
            )
})

const getCurrentUser = asyncHandler(async (req,res)=>{      // used verifyJWT middleware
   return res
            .status(200)
            .json(
               new ApiResponse(200,req.user,"logged in user fetched succesfuly")
            )

})

const updateAccountDetails = asyncHandler(async (req,res)=>{   // used verifyJWT middleware   (recheck)

   const {fullName,username} = req.body

   if(!(fullName || username)){
      throw new ApiError(400,"All fields are required to update the Acxcount Details")
   }

   let updateFields ={};

   if(fullName) updateFields.fullName = fullName
   if(username) updateFields.username = username

   const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
         $set:{
              ...updateFields
         }
      },
      {new:true}     // returns updated user object
   ).select("-password -refreshToken")

   return res
            .status(200)
            .json(
               new ApiResponse(200,updatedUser,"Account Details Updated Succesfuly")
            )

})

const updateAvatarImage = asyncHandler(async (req,res)=>{      // used multer and verifyJWT middleware 

      const avatarLocalPath = req.file?.path

      if(!avatarLocalPath){
         throw new ApiError(400,"Avatar image is required")
      }

      const avatar = await uploadFileOnCloudinary(avatarLocalPath)

      if(!avatar){
         throw new ApiError(400,"Error while uploading Avatar Image")
      }

      const updatedUser = await User.findByIdAndUpdate(
         req.user._id,
         {
            $set:{
               avatar:avatar.url
            }
         },
         {new:true}  // returns updated user object
      ).select("-password -refreshToken")

      return res
               .status(200)
               .json(
                  new ApiResponse(200,updatedUser,"Avatar Image updated Successfully")
               )

})

const updateCoverImage = asyncHandler(async (req,res)=>{       // used multer and verifyJWT middleware 

      const coverImageLocalPath = req.file?.path

      if(!coverImageLocalPath){
         throw new ApiError(400,"Cover Image is required for updation")
      }

      const coverImage = await uploadFileOnCloudinary(coverImageLocalPath)

      if(!coverImage){
         throw new ApiError(400,"Error while uploading Cover Image")
      }

      const updatedUser = await User.findByIdAndUpdate(
         req.user._id,
         {
            $set:{
               coverImage:coverImage.url
            }
         },
         {new:true}    // retunrs updated user object
      ).select("-password -refreshToken")

      return res
               .status(200)
               .json(
                  new ApiResponse(200,updatedUser,"Cover Image updated Successfully")
               )

})

const getUserChannelProfile = asyncHandler(async (req,res)=>{    // used verifyJWT middleware

   const {username} = req.body

   if(!username?.trim()){
      throw new ApiError(400,"Username is required")
   }

   const channel = await User.aggregate([
      {
         $match:{
            username:username?.toLowerCase()
         }
      },
      {
         $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
         }
      },
      {
         $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribedTo"
         }
      },
      {
         $addFields:{
            subscribersCount:{
               $size:"$subscribers"
            },
            subscribedToCount:{
               $size:"$subscribedTo"
            },
            isSubscribed:{
               $anyElementTrue:{
                  $map:{
                     input:"$subscribers",
                     as:"sub",
                     in:{$eq:[req.user._id,"$$sub.subscriber"]}
                  }
               }
            }
         }
      },
      {
         $project:{
               username:1,
               email:1,
               fullName:1,
               avatar:1,
               coverImage:1,
               subscribersCount:1,
               subscribedToCount:1,
               isSubscribed:1
         }
      }
   ])

   if(!channel.length){
      throw new ApiError(404,"Chennel does not exists")
   }

   return res
            .status(200)
            .json(
               new ApiResponse(200,channel[0],"Channel fetched succesfully")
            )
})

const getUserWatchHistory = asyncHandler(async (req,res)=>{       // used verifyJWT middleware
      const history = await User.aggregate([
         {
            $match:{
               _id: new mongoose.Types.ObjectId(req.user._id)
            }
         },
         {
            $lookup:{
               from:"videos",
               localField:"watchHistory",
               foreignField:"_id",
               as:"watchedVideos",
               pipeline:[
                  {
                     $lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"owner",
                        pipeline:[
                           {
                              $project:{
                                 username:1,
                                 fullName:1,
                                 avatar:1
                              }
                           }
                        ]
                     }
                  },

                  {
                     $addFields:{
                        owner:{
                           $first:"$owner"
                        }
                     }
                  }
                  
               ]
            }
         },
         {
            $project:{
               username:1,
               email:1,
               watchedVideos:1
            }
         }
      ])

      return res
               .status(200)
               .json(
                  new ApiResponse(200,history[0],"user watchHistory fetched succesfully")
               )
})

const isUserLoggedIn = asyncHandler(async (req,res)=>{       // used verifyJWT middleware
   return res
            .status(200)
            .json(
               new ApiResponse(200,true,"User is logged in")
            )
}) 

export { 
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken,
   changeCurrentPassword,
   getCurrentUser,
   updateAccountDetails,
   updateAvatarImage,
   updateCoverImage,
   getUserChannelProfile,
   getUserWatchHistory,
   verifyUser,
   isVerifiedUser,
   isUserLoggedIn
};