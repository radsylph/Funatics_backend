import mongoose from "mongoose";

interface like {
  owner: string;
  tweet: string;
}

const likeSchema = new mongoose.Schema<like>(
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
