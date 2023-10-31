import mongoose from "mongoose";

interface tweet {
  title: string;
  content: string;
  owner: string;
  likes: number;
  image: string;
  edited: boolean;
  isComment: boolean;
}

const tweetSchema = new mongoose.Schema<tweet>(
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
