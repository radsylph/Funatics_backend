"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tweetControllers_1 = require("../controllers/tweetControllers");
const ProtectRutes_1 = __importDefault(require("../middlewares/ProtectRutes"));
const router = express_1.default.Router();
router.route("/test").get(ProtectRutes_1.default, tweetControllers_1.testAuth);
router.route("/get/:id").get(ProtectRutes_1.default, tweetControllers_1.getTweet);
router.route("/get").get(ProtectRutes_1.default, tweetControllers_1.getTweets);
router.route("/create").post(ProtectRutes_1.default, tweetControllers_1.createTweet);
router.route("/edit/:id").put(ProtectRutes_1.default, tweetControllers_1.editTweet);
router.route("/delete/:id").delete(ProtectRutes_1.default, tweetControllers_1.deleteTweet);
router.route("/like/:id").put(ProtectRutes_1.default, tweetControllers_1.likeTweet);
router.route("/like").get(ProtectRutes_1.default, tweetControllers_1.getLikes);
router.route("/like/:id").get(ProtectRutes_1.default, tweetControllers_1.getPostLikes);
router.route("/follow/:id").put(ProtectRutes_1.default, tweetControllers_1.followUser);
router.route("/followers/:id").get(ProtectRutes_1.default, tweetControllers_1.getFollowers);
router.route("/myFollowers").get(ProtectRutes_1.default, tweetControllers_1.getMyFollowers);
router
    .route("/comment/:id")
    .post(ProtectRutes_1.default, tweetControllers_1.addComment)
    .delete(ProtectRutes_1.default, tweetControllers_1.deleteComment);
router.route("/comments/:id").get(ProtectRutes_1.default, tweetControllers_1.getComments);
router.route("/get/user/:id").get(ProtectRutes_1.default, tweetControllers_1.getUserTweets);
router.route("/followersTweets").get(ProtectRutes_1.default, tweetControllers_1.getFollowersTweets);
router.route("/mySelf/get").get(ProtectRutes_1.default, tweetControllers_1.getMyTweets);
router.route("/followingTweets/get").get(ProtectRutes_1.default, tweetControllers_1.getFollowingTweets);
exports.default = router;
