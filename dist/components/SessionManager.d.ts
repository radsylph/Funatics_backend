import { Request, Response } from "express";
interface CustomRequest extends Request {
    user?: any;
}
declare class SessionManager {
    constructor();
    createUser(req: Request, res: Response): Promise<Response>;
    verifyUser(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<Response>;
    checkResetPassword(req: Request, res: Response): Promise<void>;
    verifyNewPassword(req: Request, res: Response): Promise<Response>;
    loginVerify(req: Request, res: Response): Promise<Response>;
    login(req: Request, res: Response): Promise<Response>;
    closeSession(req: Request, res: Response): Response;
    getUser(req: CustomRequest, res: Response): Promise<Response>;
    editUser(req: CustomRequest, res: Response): Promise<Response>;
}
export { SessionManager };
