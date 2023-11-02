import mongoose from "mongoose";
import { LikeInterface } from "./main";

const likeSchema = new mongoose.Schema<LikeInterface>(
  {
    owner: {
      type: String,
      required: true,
    },
    tweet: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model("Like", likeSchema);

export default Like;
