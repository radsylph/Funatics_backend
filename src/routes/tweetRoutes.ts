import express from "express";
import {
  testAuth,
  getTweets,
  createTweet,
  getTweet,
  editTweet,
  deleteTweet,
  likeTweet,
  followUser,
  getFollowers,
  addComment,
  getComments,
  getUserTweets,
  getFollowersTweets,
  getMyTweets,
  getFollowingTweets,
  getMyFollowers,
  getLikes,
  getPostLikes,
} from "../controllers/tweetControllers";
import getUserInfo from "../middlewares/ProtectRutes";

const router = express.Router();

router.route("/test").get(getUserInfo, testAuth);
router.route("/get/:id").get(getUserInfo, getTweet);
router.route("/get").get(getUserInfo, getTweets);
router.route("/create").post(getUserInfo, createTweet);
router.route("/edit/:id").put(getUserInfo, editTweet);
router.route("/delete/:id").delete(getUserInfo, deleteTweet);
router.route("/like/:id").put(getUserInfo, likeTweet);
router.route("/like").get(getUserInfo, getLikes);
router.route("/like/:id").get(getUserInfo, getPostLikes);
router.route("/follow/:id").put(getUserInfo, followUser);
router.route("/followers/:id").get(getUserInfo, getFollowers);
router.route("/myFollowers").get(getUserInfo, getMyFollowers);
router.route("/comment/:id").post(getUserInfo, addComment);
router.route("/comments/:id").get(getUserInfo, getComments);
router.route("/get/user/:id").get(getUserInfo, getUserTweets);
router.route("/followersTweets").get(getUserInfo, getFollowersTweets);
router.route("/mySelf/get").get(getUserInfo, getMyTweets);
router.route("/followingTweets/get").get(getUserInfo, getFollowingTweets);

export default router;
