import { Router } from "express";
import {
  registerPhotographer,
  loginPhotographer,
  logoutPhotographer
} from "../controllers/photographerController.js";
import { verifyJWTPhotographer } from "../middlewares/authenticatePhotographer.middleware.js";

const router = Router();

router.post('/register', registerPhotographer);
router.post('/login', loginPhotographer);
router.get('/logout',verifyJWTPhotographer, logoutPhotographer);


export default router;