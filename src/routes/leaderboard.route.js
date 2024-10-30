import { Router } from "express";
import {
    joinEvent,
    getLeaderboard,
    updateGuess
} from "../controllers/leaderboard.controller.js"; // Ensure correct path and `.js` extension

const router = Router();

router.route("/joinEvent").post(joinEvent); 
router.route("/leaderboard/:huntId").get(getLeaderboard); 
router.route("/updateGuess").put(updateGuess);

export default router;
