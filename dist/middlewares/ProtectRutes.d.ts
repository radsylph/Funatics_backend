import { Request, Response, NextFunction } from "express";
interface CustomRequest extends Request {
    user?: any;
}
declare const getUserInfo: (req: CustomRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export default getUserInfo;
