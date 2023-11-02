import mongoose from "mongoose";
import { TweetInterface } from "./main";

const tweetSchema = new mongoose.Schema<TweetInterface>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: null,
    },
    owner: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: null,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    isComment: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Tweet = mongoose.model("Tweet", tweetSchema);

export default Tweet;
