import { Request, Response } from "express";
import { TweetManager } from "../components/TweetManager";

const tweetManager = new TweetManager();

interface CustomRequest extends Request {
  user?: any;
}

const testAuth = (req: CustomRequest, res: Response): void => {
  res.status(200).json({
    message: "You are authenticated",
  });
};

const getTweets = (req: CustomRequest, res: Response): void => {
  tweetManager.getTweets(req, res);
};

const getTweet = (req: CustomRequest, res: Response): void => {
  tweetManager.getTweet(req, res);
};

const createTweet = (req: CustomRequest, res: Response): void => {
  tweetManager.createTweet(req, res);
};

const editTweet = (req: CustomRequest, res: Response): void => {
  tweetManager.editTweet(req, res);
};

const deleteTweet = (req: CustomRequest, res: Response): void => {
  tweetManager.deleteTweet(req, res);
};

const likeTweet = (req: CustomRequest, res: Response): void => {
  tweetManager.likeTweet(req, res);
};

const getPostLikes = (req: CustomRequest, res: Response): void => {
  tweetManager.getPostLikes(req, res);
};

const getLikes = (req: CustomRequest, res: Response): void => {
  tweetManager.getLikes(req, res);
};

const followUser = (req: CustomRequest, res: Response): void => {
  tweetManager.followUser(req, res);
};

const getFollowers = (req: CustomRequest, res: Response): void => {
  tweetManager.getFollowers(req, res);
};

const getMyFollowers = (req: CustomRequest, res: Response): void => {
  tweetManager.getMyFollowers(req, res);
};

const addComment = (req: CustomRequest, res: Response): void => {
  tweetManager.addComment(req, res);
};

const deleteComment = (req: CustomRequest, res: Response): void => {
  tweetManager.deleteComment(req, res);
};

const getComments = (req: CustomRequest, res: Response): void => {
  tweetManager.getComments(req, res);
};

const getUserTweets = (req: CustomRequest, res: Response): void => {
  tweetManager.getUserTweet(req, res);
};

const getMyTweets = (req: CustomRequest, res: Response): void => {
  tweetManager.getMyTweets(req, res);
};

const getFollowersTweets = (req: CustomRequest, res: Response): void => {
  tweetManager.getFollowersTweets(req, res);
};

const getFollowingTweets = (req: CustomRequest, res: Response): void => {
  tweetManager.getFollowingTweets(req, res);
};

export {
  testAuth,
  getTweets,
  getTweet,
  createTweet,
  editTweet,
  deleteTweet,
  likeTweet,
  followUser,
  getFollowers,
  getMyFollowers,
  addComment,
  getComments,
  getUserTweets,
  getFollowersTweets,
  getMyTweets,
  getFollowingTweets,
  getLikes,
  getPostLikes,
  deleteComment,
};
