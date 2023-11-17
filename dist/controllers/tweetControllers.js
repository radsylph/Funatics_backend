"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.getPostLikes = exports.getLikes = exports.getFollowingTweets = exports.getMyTweets = exports.getFollowersTweets = exports.getUserTweets = exports.getComments = exports.addComment = exports.getMyFollowers = exports.getFollowers = exports.followUser = exports.likeTweet = exports.deleteTweet = exports.editTweet = exports.createTweet = exports.getTweet = exports.getTweets = exports.testAuth = void 0;
const TweetManager_1 = require("../components/TweetManager");
const tweetManager = new TweetManager_1.TweetManager();
const testAuth = (req, res) => {
    res.status(200).json({
        message: "You are authenticated",
    });
};
exports.testAuth = testAuth;
const getTweets = (req, res) => {
    tweetManager.getTweets(req, res);
};
exports.getTweets = getTweets;
const getTweet = (req, res) => {
    tweetManager.getTweet(req, res);
};
exports.getTweet = getTweet;
const createTweet = (req, res) => {
    tweetManager.createTweet(req, res);
};
exports.createTweet = createTweet;
const editTweet = (req, res) => {
    tweetManager.editTweet(req, res);
};
exports.editTweet = editTweet;
const deleteTweet = (req, res) => {
    tweetManager.deleteTweet(req, res);
};
exports.deleteTweet = deleteTweet;
const likeTweet = (req, res) => {
    tweetManager.likeTweet(req, res);
};
exports.likeTweet = likeTweet;
const getPostLikes = (req, res) => {
    tweetManager.getPostLikes(req, res);
};
exports.getPostLikes = getPostLikes;
const getLikes = (req, res) => {
    tweetManager.getLikes(req, res);
};
exports.getLikes = getLikes;
const followUser = (req, res) => {
    tweetManager.followUser(req, res);
};
exports.followUser = followUser;
const getFollowers = (req, res) => {
    tweetManager.getFollowers(req, res);
};
exports.getFollowers = getFollowers;
const getMyFollowers = (req, res) => {
    tweetManager.getMyFollowers(req, res);
};
exports.getMyFollowers = getMyFollowers;
const addComment = (req, res) => {
    tweetManager.addComment(req, res);
};
exports.addComment = addComment;
const deleteComment = (req, res) => {
    tweetManager.deleteComment(req, res);
};
exports.deleteComment = deleteComment;
const getComments = (req, res) => {
    tweetManager.getComments(req, res);
};
exports.getComments = getComments;
const getUserTweets = (req, res) => {
    tweetManager.getUserTweet(req, res);
};
exports.getUserTweets = getUserTweets;
const getMyTweets = (req, res) => {
    tweetManager.getMyTweets(req, res);
};
exports.getMyTweets = getMyTweets;
const getFollowersTweets = (req, res) => {
    tweetManager.getFollowersTweets(req, res);
};
exports.getFollowersTweets = getFollowersTweets;
const getFollowingTweets = (req, res) => {
    tweetManager.getFollowingTweets(req, res);
};
exports.getFollowingTweets = getFollowingTweets;
