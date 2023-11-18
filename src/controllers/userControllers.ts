import { Request, Response } from "express";
import { SessionManager } from "../components/SessionManager";

const session = new SessionManager();

const createUser = (req: Request, res: Response): void => {
  session.createUser(req, res);
};

const createForm = (req: Request, res: Response): void => {
  res.json({
    message: "Formulario de registro",
    status: 200,
  });
};

const confirmAccount = (req: Request, res: Response): void => {
  session.verifyUser(req, res);
};

const login = (req: Request, res: Response): void => {
  // session.loginVerify(req, res);
  session.login(req, res);
};

const testingpug = (req: Request, res: Response): void => {
  res.render("auth/confirm_account", {
    title: "confirm your account",
    pagina: "Your account is now confirmed",
  });
};

const formReset = (req: Request, res: Response): void => {
  res.render("auth/reset_password", {
    title: "Reset your password",
    pagina: "Reset your password",
  });
};

const resetPassword = (req: Request, res: Response): void => {
  session.resetPassword(req, res);
};

const newPassword = (req: Request, res: Response): void => {
  session.verifyNewPassword(req, res);
};

const verifyPassword = (req: Request, res: Response): void => {
  session.checkResetPassword(req, res);
};

const getUser = (req: Request, res: Response): void => {
  session.getUser(req, res);
};

const getAuser = (req: Request, res: Response): void => {
  session.getAuser(req, res);
};

const editUser = (req: Request, res: Response): void => {
  session.editUser(req, res);
};

const deleteUser = (req: Request, res: Response): void => {
  session.deleteUser(req, res);
};

const pugTest1 = (req: Request, res: Response): void => {
  res.render("auth/confirm_account", {
    title: "confirm your account",
    pagina: "Your account is now confirmed",
  });
};

const pugTest2 = (req: Request, res: Response): void => {
  res.render("auth/reset_password", {
    title: "Reset your password",
    pagina: "Reset your password",
  });
};

const pugTest3 = (req: Request, res: Response): void => {
  res.render("auth/set_new_password", {
    title: "Reset your password",
    pagina: "Reset your password",
  });
};

export {
  createUser,
  createForm,
  confirmAccount,
  testingpug,
  resetPassword,
  formReset,
  newPassword,
  verifyPassword,
  login,
  pugTest1,
  pugTest2,
  pugTest3,
  getUser,
  editUser,
  getAuser,
  deleteUser,
};
