import {Router} from 'express'

import 
{
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
} from '../controllers/user.controller.js';

import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/authenticate.middleware.js';
import { sendVerificationToken } from '../services/sendVerificationToken.js';

const router = Router()

router.route("/register").post( registerUser)

router.route("/login").post(loginUser)

// secured Routes

router.route("/logout").get(verifyJWT, logoutUser)
router.route("/is-logged-in").get(verifyJWT, isUserLoggedIn)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-details").patch(verifyJWT,updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateAvatarImage)
router.route("/update-coverImage").patch(verifyJWT,upload.single("coverImage"),updateCoverImage)
router.route("/channel").post(verifyJWT,getUserChannelProfile)
router.route("/watch-history").get(verifyJWT,getUserWatchHistory)
router.route("/email/verify/:token").get(verifyUser)
router.route("/email/is-verify/:email").get(isVerifiedUser)


export default router;