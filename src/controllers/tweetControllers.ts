import { Request, Response } from "express";

interface CustomRequest extends Request {
  user?: any;
}

const testAuth = (req: CustomRequest, res: Response): void => {
  res.status(200).json({
    message: "You are authenticated",
  });
};

export { testAuth };
