import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

mongoose.connect(
  `mongodb+srv://test1:123@cluster0.gpskocw.mongodb.net/funatics?retryWrites=true&w=majority`
);

const db = mongoose.connection;

export default db;
