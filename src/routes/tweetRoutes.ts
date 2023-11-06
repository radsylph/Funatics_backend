import express from "express";
import { testAuth } from "../controllers/tweetControllers";
import getUserInfo from "../middlewares/ProtectRutes";

const router = express.Router();

router.route("/test").get(getUserInfo, testAuth);

export default router;
