import mongoose from "mongoose";

interface follow {
  personToFollow: string;
  personThatFollows: string;
}

const followSchema = new mongoose.Schema<follow>(
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
