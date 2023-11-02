import mongoose from "mongoose";
import { FollowInterface } from "./main";

const followSchema = new mongoose.Schema<FollowInterface>(
  {
    personToFollow: {
      type: String,
      required: true,
    },
    personThatFollows: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Follow = mongoose.model("Follow", followSchema);
export default Follow;
