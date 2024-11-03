import { Router } from "express";
import {
    getLeaderboard, getScore
} from "../controllers/leaderboard.controller.js"; 
import { isVerified } from "../middlewares/auth.middleware.js";

const router = Router();
 
router.route("/leaderboard/:huntId", isVerified).get(getLeaderboard); 
router.route("/score/:huntId", isVerified).get(getScore); 


export default router;
