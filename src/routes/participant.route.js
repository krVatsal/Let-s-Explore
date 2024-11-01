import { Router } from "express";
import { getLiveHunts, getUpcomingEvents, createHunt, participate, yourHunts, submitGuess, getParticipant, isImageCorrect} from "../controllers/participant.controller.js";
import { isVerified } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"
const router= Router()
router.route("/liveHunts").get(getLiveHunts)
router.route("/upcomingHunts").get(getUpcomingEvents)
router.route("/createHunt", isVerified).post(createHunt)
router.route("/participate", isVerified).post(participate)
router.route("/yourHunts", isVerified).get(yourHunts)
router.route("/verifyImage", isVerified).post(isImageCorrect)
router.route("/submitGuess", isVerified).put(
    upload.fields([
        {
           name: "image",
           maxCount: 1
        }
     ]),
    submitGuess)
router.route("/getParticipants/:huntId", isVerified).get(getParticipant)

export default router