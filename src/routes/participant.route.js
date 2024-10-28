import { Router } from "express";
import { getLiveHunts, getUpcomingEvents, createHunt } from "../controllers/participant.controller.js";

const router= Router()
router.route("/liveHunts").get(getLiveHunts)
router.route("/upcomingHunts").get(getUpcomingEvents)
router.route("/createHunt").post(createHunt)

export default router