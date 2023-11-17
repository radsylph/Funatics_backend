"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetManager = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const main_1 = require("../models/main");
const express_validator_1 = require("express-validator");
class TweetManager {
    constructor() { }
    createTweet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, express_validator_1.check)("title")
                .notEmpty()
                .withMessage("the title is obligatory")
                .isLength({ max: 150 })
                .withMessage("the title must be less than 150 characters")
                .run(req);
            yield (0, express_validator_1.check)("content")
                .optional()
                .isLength({ max: 500 })
                .withMessage("the content must be less than 500 characters")
                .run(req);
            yield (0, express_validator_1.check)("image").optional().run(req);
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "you have these errors",
                    errors: result.array(),
                });
            }
            const { title, content, image } = req.body;
            const { owner } = req.user._id;
            console.log(owner);
            console.log(req.body);
            try {
                const newTweet = new main_1.Tweet({
                    title,
                    content,
                    owner: req.user._id,
                    image: image ? image : "image.png",
                    edited: false,
                    isComment: false,
                    comments: 0,
                    likes: 0,
                    PostToComment: null,
                });
                yield newTweet.save();
                return res.status(200).json({
                    message: "Tweet created",
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "Tweet not created",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when creating the user",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    editTweet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, express_validator_1.check)("title")
                .notEmpty()
                .withMessage("the title is obligatory")
                .isLength({ max: 150 })
                .withMessage("the title must be less than 150 characters")
                .run(req);
            yield (0, express_validator_1.check)("content")
                .optional()
                .isLength({ max: 500 })
                .withMessage("the content must be less than 500 characters")
                .run(req);
            yield (0, express_validator_1.check)("image").optional().run(req);
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "you have these errors",
                    errors: result.array(),
                });
            }
            const { title, content, image } = req.body;
            const { id } = req.params;
            const tweet = yield main_1.Tweet.findOne({ _id: id });
            if (!tweet) {
                return res.status(404).json({
                    message: "Tweet not found",
                    status: 404,
                });
            }
            if (tweet.owner != req.user._id) {
                return res.status(403).json({
                    message: "you can't edit this tweet",
                    status: 403,
                });
            }
            try {
                const tweetEdited = yield main_1.Tweet.updateOne({ _id: id }, { title, content, image, edited: true });
                return res.status(200).json({
                    message: "Tweet edited",
                    tweetEdited,
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "Tweet not created",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when editing the tweet",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    deleteTweet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const tweet = yield main_1.Tweet.findOne({ _id: id });
            if (!tweet) {
                return res.status(404).json({
                    message: "Tweet not found",
                    status: 404,
                });
            }
            if (tweet.owner != req.user._id) {
                return res.status(403).json({
                    message: "you can't delete this tweet",
                    status: 403,
                });
            }
            if (tweet.isComment === true) {
                try {
                    const TweetParent = yield main_1.Tweet.findOne({ _id: tweet.PostToComment });
                    if (!TweetParent) {
                        return res.status(404).json({
                            message: "Tweet not found",
                            status: 404,
                        });
                    }
                    TweetParent.comments = TweetParent.comments - 1;
                    yield TweetParent.save();
                    yield main_1.Tweet.deleteOne({ _id: id });
                    return res.status(200).json({
                        message: "Comment deleted",
                    });
                }
                catch (error) {
                    return res.status(500).json({
                        message: "Tweet not deleted",
                        errors: [
                            {
                                type: "server",
                                value: "",
                                msg: "there was an error when deleting the tweet",
                                errors: error,
                                path: "",
                                location: "deleteTweet",
                            },
                        ],
                    });
                }
            }
            else {
                try {
                    yield main_1.Tweet.deleteOne({ _id: id });
                    return res.status(200).json({
                        message: "Tweet deleted",
                    });
                }
                catch (error) {
                    return res.status(500).json({
                        message: "Tweet not deleted",
                        errors: [
                            {
                                type: "server",
                                value: "",
                                msg: "there was an error when deleting the tweet",
                                errors: error,
                                path: "",
                                location: "deleteTweet",
                            },
                        ],
                    });
                }
            }
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const comment = yield main_1.Tweet.findOne({ _id: id });
            if (!comment) {
                return res.status(404).json({
                    message: "Comment not found",
                    status: 404,
                });
            }
            if (comment.owner != req.user._id) {
                return res.status(403).json({
                    message: "you can't delete this comment",
                    status: 403,
                });
            }
            if (comment.isComment === false) {
                return res.status(403).json({
                    message: "this is not a comment",
                    status: 403,
                });
            }
            try {
                const TweetParent = yield main_1.Tweet.findOne({ _id: comment.PostToComment });
                if (!TweetParent) {
                    return res.status(404).json({
                        message: "Tweet not found",
                        status: 404,
                    });
                }
                TweetParent.comments = TweetParent.comments - 1;
                yield TweetParent.save();
                yield main_1.Tweet.deleteOne({ _id: id });
                return res.status(200).json({
                    message: "Comment deleted",
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "Tweet not deleted",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when deleting the tweet",
                            errors: error,
                            path: "",
                            location: "deleteTweet",
                        },
                    ],
                });
            }
        });
    }
    getTweets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tweets = yield main_1.Tweet.find({ isComment: false }).populate({
                    path: "owner",
                    select: "name lastname username profilePicture",
                });
                const likes = yield main_1.Like.find({ owner: req.user._id });
                const likedTweetIds = new Set(likes.map((like) => like.tweet.toString()));
                const tweetsWithIsLiked = tweets.map((tweet) => {
                    const isLiked = likedTweetIds.has(tweet._id.toString());
                    return Object.assign(Object.assign({}, tweet.toObject()), { isLiked });
                });
                return res.status(200).json({
                    message: "Tweets found",
                    tweets: tweetsWithIsLiked,
                    OwnerInitial: req.user._id,
                    likes,
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "Tweets not found",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when finding the tweets",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    getMyTweets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tweets = yield main_1.Tweet.find({ owner: req.user._id }).populate("owner");
                return res.status(200).json({
                    message: "Tweets found",
                    tweets,
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "Tweets not found",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when finding the tweets",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    getTweet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid tweet ID",
                    status: 400,
                });
            }
            try {
                const tweet = yield main_1.Tweet.findOne({ _id: id }).populate("owner");
                if (!tweet) {
                    return res.status(404).json({
                        message: "Tweet not found",
                        status: 404,
                    });
                }
                const likes = yield main_1.Like.find({ owner: req.user._id });
                const likedTweetIds = new Set(likes.map((like) => like.tweet.toString()));
                const tweetsWithIsLiked = tweet.toObject();
                const isLiked = likedTweetIds.has(tweet._id.toString());
                tweetsWithIsLiked.isLiked = isLiked;
                return res.status(200).json({
                    message: "Tweet found",
                    tweetsWithIsLiked,
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "Tweet not found",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when finding the tweet",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    likeTweet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid user ID",
                    status: 400,
                });
            }
            const tweet = yield main_1.Tweet.findOne({ _id: id });
            if (!tweet) {
                return res.status(404).json({
                    message: "Tweet not found",
                    status: 404,
                });
            }
            try {
                const like = yield main_1.Like.findOne({ owner: req.user._id, tweet: id });
                if (like) {
                    yield main_1.Like.deleteOne({ owner: req.user._id, tweet: id });
                    yield main_1.Tweet.updateOne({ _id: id }, { $inc: { likes: -1 } });
                    return res.status(201).json({
                        message: "Post unliked",
                    });
                }
                const newLike = new main_1.Like({
                    owner: req.user._id,
                    tweet: id,
                });
                yield newLike.save();
                yield main_1.Tweet.updateOne({ _id: id }, { $inc: { likes: 1 } });
                return res.status(200).json({
                    message: "Post liked",
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "Tweet not liked",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when liking the tweet",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    getPostLikes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid user ID",
                    status: 400,
                });
            }
            const tweet = yield main_1.Tweet.findOne({ _id: id });
            if (!tweet) {
                return res.status(404).json({
                    message: "Tweet not found",
                    status: 404,
                });
            }
            try {
                const likes = yield main_1.Like.find({ tweet: id }).populate("owner");
                return res.status(200).json({
                    message: "Likes found",
                    likes,
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "Likes not found",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when finding the likes",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    getLikes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const { id } = req.params;
            // if (!mongoose.Types.ObjectId.isValid(id)) {
            //   return res.status(400).json({
            //     message: "Invalid user ID",
            //     status: 400,
            //   });
            // }
            // const tweet = await Tweet.findOne({});
            // if (!tweet) {
            //   return res.status(404).json({
            //     message: "Tweet not found",
            //     status: 404,
            //   });
            // }
            try {
                const likes = yield main_1.Like.find({}).populate("owner");
                return res.status(200).json({
                    message: "Likes found",
                    likes,
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "Likes not found",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when finding the likes",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    followUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid user ID",
                    status: 400,
                });
            }
            const user = yield main_1.Usuario.findOne({ _id: id });
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    status: 404,
                });
            }
            try {
                const follow = yield main_1.Follow.findOne({
                    personToFollow: id,
                    personThatFollows: req.user._id,
                });
                if (follow) {
                    yield follow.deleteOne({
                        personToFollow: id,
                        personThatFollows: req.user._id,
                    });
                    yield main_1.Usuario.updateOne({ _id: id }, { $inc: { followers: -1 } });
                    yield main_1.Usuario.updateOne({ _id: req.user._id }, { $inc: { following: -1 } });
                    return res.status(200).json({
                        message: "User unfollowed",
                    });
                }
                const newFollow = new main_1.Follow({
                    personToFollow: id,
                    personThatFollows: req.user._id,
                });
                yield newFollow.save();
                yield main_1.Usuario.updateOne({ _id: id }, { $inc: { followers: 1 } });
                yield main_1.Usuario.updateOne({ _id: req.user._id }, { $inc: { following: 1 } });
                return res.status(200).json({
                    message: "User followed",
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "Tweet not liked",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when following the user",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    getFollowers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid user ID",
                    status: 400,
                });
            }
            try {
                const followers = yield main_1.Follow.find({
                    personToFollow: id,
                }).exec();
                const Followers = yield main_1.Usuario.find({
                    _id: followers.map((follower) => follower.personThatFollows),
                }).exec();
                return res.status(200).json({
                    message: "Followers found",
                    Followers,
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "Followers not found",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when finding the followers",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    getMyFollowers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followers = yield main_1.Follow.find({
                    personToFollow: req.user._id,
                }).exec();
                const Followers = yield main_1.Usuario.find({
                    _id: followers.map((follower) => follower.personThatFollows),
                }).exec();
                return res.status(200).json({
                    message: "Followers found",
                    Followers,
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "Followers not found",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when finding the followers",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    addComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { content } = req.body;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid tweet ID",
                    status: 400,
                });
            }
            const tweet = main_1.Tweet.findOne({ _id: id });
            if (!tweet) {
                return res.status(404).json({
                    message: "Tweet not found",
                    status: 404,
                });
            }
            try {
                const newComment = new main_1.Tweet({
                    title: "",
                    content,
                    owner: req.user._id,
                    image: "image.png",
                    edited: false,
                    isComment: true,
                    comments: 0,
                    likes: 0,
                    PostToComment: id,
                });
                yield newComment.save();
                yield main_1.Tweet.updateOne({ _id: id }, { $inc: { comments: 1 } });
                return res.status(200).json({
                    message: "Comment created",
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "Comment not created",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when creating the comment",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid tweet ID",
                    status: 400,
                });
            }
            try {
                const comments = yield main_1.Tweet.find({
                    PostToComment: id,
                }).populate("owner");
                const likes = yield main_1.Like.find({ owner: req.user._id });
                const likedTweetIds = new Set(likes.map((like) => like.tweet.toString()));
                const commentsWithIsLiked = comments.map((comment) => {
                    const isLiked = likedTweetIds.has(comment._id.toString());
                    return Object.assign(Object.assign({}, comment.toObject()), { isLiked });
                });
                return res.status(200).json({
                    message: "Comments found",
                    commentsWithIsLiked,
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "Comments not found",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when finding the comments",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    getPhoneCache(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, express_validator_1.check)("title")
                .notEmpty()
                .withMessage("the title is obligatory")
                .isLength({ max: 150 })
                .withMessage("the title must be less than 150 characters")
                .run(req);
            yield (0, express_validator_1.check)("content")
                .optional()
                .isLength({ max: 500 })
                .withMessage("the content must be less than 500 characters")
                .run(req);
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "you have these errors",
                    errors: result.array(),
                });
            }
            const { title, content } = req.body;
            const { owner } = req.user._id;
            console.log(owner);
            console.log(req.body);
            try {
                const newTweet = new main_1.Tweet({
                    title,
                    content,
                    owner: req.user._id,
                    image: "image.png",
                    edited: false,
                    isComment: false,
                    comments: 0,
                    likes: 0,
                    PostToComment: null,
                });
                yield newTweet.save();
                return res.status(200).json({
                    message: "Tweet created",
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "Tweet not created",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when creating the user",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    getUserTweet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid tweet ID",
                    status: 400,
                });
            }
            try {
                const user = yield main_1.Usuario.find({
                    _id: id,
                });
                if (!user) {
                    return res.status(404).json({
                        message: "user not found",
                        status: 404,
                    });
                }
                console.log(user);
                const tweets = yield main_1.Tweet.find({
                    owner: user.map((user) => user.id),
                    isComment: false,
                }).populate("owner");
                return res.status(200).json({
                    message: "Tweets found by user",
                    user,
                    tweets,
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "Tweets not found by user",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when finding the tweets by user",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    getFollowersTweets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followers = yield main_1.Follow.find({
                    personToFollow: req.user._id,
                }).exec();
                const Followers = yield main_1.Usuario.find({
                    _id: followers.map((follower) => follower.personThatFollows),
                }).exec();
                const tweets = yield main_1.Tweet.find({
                    owner: Followers.map((follower) => follower._id),
                }).populate("owner");
                const likes = yield main_1.Like.find({ owner: req.user._id });
                const likedTweetIds = new Set(likes.map((like) => like.tweet.toString()));
                const tweetsWithIsLiked = tweets.map((tweet) => {
                    const isLiked = likedTweetIds.has(tweet._id.toString());
                    return Object.assign(Object.assign({}, tweet.toObject()), { isLiked });
                });
                return res.status(200).json({
                    message: "Followers tweets found",
                    tweetsWithIsLiked,
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "Followers tweets not found",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when finding the followers tweets",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    getFollowingTweets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const following = yield main_1.Follow.find({
                    personThatFollows: req.user._id,
                }).exec();
                const Following = yield main_1.Usuario.find({
                    _id: following.map((follower) => follower.personToFollow),
                }).exec();
                const tweets = yield main_1.Tweet.find({
                    owner: Following.map((follower) => follower._id),
                    isComment: false,
                }).populate("owner");
                const likes = yield main_1.Like.find({ owner: req.user._id });
                const likedTweetIds = new Set(likes.map((like) => like.tweet.toString()));
                const tweetsWithIsLiked = tweets.map((tweet) => {
                    const isLiked = likedTweetIds.has(tweet._id.toString());
                    return Object.assign(Object.assign({}, tweet.toObject()), { isLiked });
                });
                return res.status(200).json({
                    message: "Following tweets found",
                    tweetsWithIsLiked,
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "Following tweets not found",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when finding the following tweets",
                            errors: error,
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
}
exports.TweetManager = TweetManager;
