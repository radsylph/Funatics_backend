import { Request, Response } from "express";
import { Usuario, Tweet, Like, Follow } from "../models/main";

interface CustomRequest extends Request {
  user?: any;
}

class TweetManager {
  constructor() {}

}
