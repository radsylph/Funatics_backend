import { Request, Response } from "express";
import mongoose from "mongoose";
import { Usuario, Tweet, Like, Follow } from "../models/main";
import { check, validationResult } from "express-validator";

interface CustomRequest extends Request {
  user?: any;
  user_id?: any;
}

class TweetManager {
  constructor() {}

  async createTweet(req: CustomRequest, res: Response) {
    await check("title")
      .notEmpty()
      .withMessage("the title is obligatory")
      .isLength({ max: 150 })
      .withMessage("the title must be less than 150 characters")
      .run(req);
    await check("content")
      .optional()
      .isLength({ max: 500 })
      .withMessage("the content must be less than 500 characters")
      .run(req);

    const result = validationResult(req);
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
      const newTweet = new Tweet({
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
      await newTweet.save();
      return res.status(200).json({
        message: "Tweet created",
      });
    } catch (error) {
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
  }

  async editTweet(req: CustomRequest, res: Response) {
    //agregar validacion de que el tweet sea del usuario
    await check("title")
      .notEmpty()
      .withMessage("the title is obligatory")
      .isLength({ max: 150 })
      .withMessage("the title must be less than 150 characters")
      .run(req);
    await check("content")
      .optional()
      .isLength({ max: 500 })
      .withMessage("the content must be less than 500 characters")
      .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: "you have these errors",
        errors: result.array(),
      });
    }
    const { title, content } = req.body;
    const { id } = req.params;
    const tweet = await Tweet.findOne({ _id: id });
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
      const tweetEdited = await Tweet.updateOne(
        { _id: id },
        { title, content, edited: true }
      );
      return res.status(200).json({
        message: "Tweet edited",
        tweetEdited,
      });
    } catch (error) {
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
  }

  async deleteTweet(req: CustomRequest, res: Response) {
    const { id } = req.params;

    const tweet = await Tweet.findOne({ _id: id });
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

    try {
      await Tweet.deleteOne({ _id: id });
      return res.status(200).json({
        message: "Tweet deleted",
      });
    } catch (error) {
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

  async getTweets(req: CustomRequest, res: Response) {
    try {
      const tweets = await Tweet.find({ isComment: false }).populate({
        path: "owner",
        select: "name lastname username profilePicture",
      });
      return res.status(200).json({
        message: "Tweets found",
        tweets,
        OwnerInitial: req.user._id,
      });
    } catch (error) {
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
  }

  async getMyTweets(req: CustomRequest, res: Response) {
    try {
      const tweets = await Tweet.find({ owner: req.user._id }).populate(
        "owner"
      );
      return res.status(200).json({
        message: "Tweets found",
        tweets,
      });
    } catch (error) {
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
  }

  async getTweet(req: CustomRequest, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid tweet ID",
        status: 400,
      });
    }

    try {
      const tweet = await Tweet.findOne({ _id: id }).populate("owner");
      if (!tweet) {
        return res.status(404).json({
          message: "Tweet not found",
          status: 404,
        });
      }
      return res.status(200).json({
        message: "Tweet found",
        tweet,
      });
    } catch (error) {
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
  }

  async likeTweet(req: CustomRequest, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
        status: 400,
      });
    }

    const tweet = await Tweet.findOne({ _id: id });
    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found",
        status: 404,
      });
    }
    try {
      const like = await Like.findOne({ owner: req.user._id, tweet: id });
      if (like) {
        await Like.deleteOne({ owner: req.user._id, tweet: id });
        await Tweet.updateOne({ _id: id }, { $inc: { likes: -1 } });
        return res.status(201).json({
          message: "Post unliked",
        });
      }

      const newLike = new Like({
        owner: req.user._id,
        tweet: id,
      });
      await newLike.save();
      await Tweet.updateOne({ _id: id }, { $inc: { likes: 1 } });
      return res.status(200).json({
        message: "Post liked",
      });
    } catch (error) {
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
  }

  async getLikes(req: CustomRequest, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
        status: 400,
      });
    }

    const tweet = await Tweet.findOne({ _id: id });
    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found",
        status: 404,
      });
    }
    try {
      const likes = await Like.find({ tweet: id }).populate("owner");
      return res.status(200).json({
        message: "Likes found",
        likes,
      });
    } catch (error) {
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
  }

  async followUser(req: CustomRequest, res: Response) {
    const { id } = req.params;
    console.log(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
        status: 400,
      });
    }

    const user = await Usuario.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }

    try {
      const follow = await Follow.findOne({
        personToFollow: id,
        personThatFollows: req.user._id,
      });
      if (follow) {
        await follow.deleteOne({
          personToFollow: id,
          personThatFollows: req.user._id,
        });
        await Usuario.updateOne({ _id: id }, { $inc: { followers: -1 } });
        await Usuario.updateOne(
          { _id: req.user._id },
          { $inc: { following: -1 } }
        );

        return res.status(200).json({
          message: "User unfollowed",
        });
      }
      const newFollow = new Follow({
        personToFollow: id,
        personThatFollows: req.user._id,
      });
      await newFollow.save();
      await Usuario.updateOne({ _id: id }, { $inc: { followers: 1 } });
      return res.status(200).json({
        message: "User followed",
      });
    } catch (error) {
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
  }

  async getFollowers(req: CustomRequest, res: Response) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
        status: 400,
      });
    }
    try {
      const followers = await Follow.find({
        personToFollow: id,
      }).exec();
      const Followers = await Usuario.find({
        _id: followers.map((follower) => follower.personThatFollows),
      }).exec();
      return res.status(200).json({
        message: "Followers found",
        Followers,
      });
    } catch (error) {
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
  }

  async getMyFollowers(req: CustomRequest, res: Response) {
    try {
      const followers = await Follow.find({
        personToFollow: req.user._id,
      }).exec();
      const Followers = await Usuario.find({
        _id: followers.map((follower) => follower.personThatFollows),
      }).exec();
      return res.status(200).json({
        message: "Followers found",
        Followers,
      });
    } catch (error) {
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
  }

  async addComment(req: CustomRequest, res: Response) {
    const { id } = req.params;
    const { content } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid tweet ID",
        status: 400,
      });
    }
    const tweet = Tweet.findOne({ _id: id });
    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found",
        status: 404,
      });
    }

    try {
      const newComment = new Tweet({
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
      await newComment.save();
      await Tweet.updateOne({ _id: id }, { $inc: { comments: 1 } });
      return res.status(200).json({
        message: "Comment created",
      });
    } catch (error) {
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
  }

  async getComments(req: CustomRequest, res: Response) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid tweet ID",
        status: 400,
      });
    }
    try {
      const comments = await Tweet.find({
        PostToComment: id,
      }).populate("owner");
      return res.status(200).json({
        message: "Comments found",
        comments,
      });
    } catch (error) {
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
  }

  async getPhoneCache(req: CustomRequest, res: Response) {
    await check("title")
      .notEmpty()
      .withMessage("the title is obligatory")
      .isLength({ max: 150 })
      .withMessage("the title must be less than 150 characters")
      .run(req);
    await check("content")
      .optional()
      .isLength({ max: 500 })
      .withMessage("the content must be less than 500 characters")
      .run(req);

    const result = validationResult(req);
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
      const newTweet = new Tweet({
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
      await newTweet.save();
      return res.status(200).json({
        message: "Tweet created",
      });
    } catch (error) {
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
  }

  async getUserTweet(req: CustomRequest, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid tweet ID",
        status: 400,
      });
    }

    try {
      const user = await Usuario.find({
        _id: id,
      });
      if (!user) {
        return res.status(404).json({
          message: "user not found",
          status: 404,
        });
      }
      console.log(user);
      const tweets = await Tweet.find({
        owner: user.map((user) => user.id),
        isComment: false,
      }).populate("owner");
      return res.status(200).json({
        message: "Tweets found by user",
        user,
        tweets,
      });
    } catch (error) {
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
  }

  async getFollowersTweets(req: CustomRequest, res: Response) {
    try {
      const followers = await Follow.find({
        personToFollow: req.user._id,
      }).exec();
      const Followers = await Usuario.find({
        _id: followers.map((follower) => follower.personThatFollows),
      }).exec();
      const tweets = await Tweet.find({
        owner: Followers.map((follower) => follower._id),
      }).populate("owner");
      return res.status(200).json({
        message: "Followers tweets found",
        tweets,
      });
    } catch (error) {
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
  }

  async getFollowingTweets(req: CustomRequest, res: Response) {
    try {
      const following = await Follow.find({
        personThatFollows: req.user._id,
      }).exec();
      const Following = await Usuario.find({
        _id: following.map((follower) => follower.personToFollow),
      }).exec();
      const tweets = await Tweet.find({
        owner: Following.map((follower) => follower._id),
        isComment: false,
      }).populate("owner");
      return res.status(200).json({
        message: "Following tweets found",
        tweets,
      });
    } catch (error) {
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
  }
}

export { TweetManager };
