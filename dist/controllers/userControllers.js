"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUser = exports.getUser = exports.pugTest3 = exports.pugTest2 = exports.pugTest1 = exports.login = exports.verifyPassword = exports.newPassword = exports.formReset = exports.resetPassword = exports.testingpug = exports.confirmAccount = exports.createForm = exports.createUser = void 0;
const SessionManager_1 = require("../components/SessionManager");
const session = new SessionManager_1.SessionManager();
const createUser = (req, res) => {
    session.createUser(req, res);
};
exports.createUser = createUser;
const createForm = (req, res) => {
    res.json({
        message: "Formulario de registro",
        status: 200,
    });
};
exports.createForm = createForm;
const confirmAccount = (req, res) => {
    session.verifyUser(req, res);
};
exports.confirmAccount = confirmAccount;
const login = (req, res) => {
    // session.loginVerify(req, res);
    session.login(req, res);
};
exports.login = login;
const testingpug = (req, res) => {
    res.render("auth/confirm_account", {
        title: "confirm your account",
        pagina: "Your account is now confirmed",
    });
};
exports.testingpug = testingpug;
const formReset = (req, res) => {
    res.render("auth/reset_password", {
        title: "Reset your password",
        pagina: "Reset your password",
    });
};
exports.formReset = formReset;
const resetPassword = (req, res) => {
    session.resetPassword(req, res);
};
exports.resetPassword = resetPassword;
const newPassword = (req, res) => {
    session.verifyNewPassword(req, res);
};
exports.newPassword = newPassword;
const verifyPassword = (req, res) => {
    session.checkResetPassword(req, res);
};
exports.verifyPassword = verifyPassword;
const getUser = (req, res) => {
    session.getUser(req, res);
};
exports.getUser = getUser;
const editUser = (req, res) => {
    session.editUser(req, res);
};
exports.editUser = editUser;
// const deleteUser = (req: Request, res: Response): void => {
//   session.deleteUser(req, res);
// };
const pugTest1 = (req, res) => {
    res.render("auth/confirm_account", {
        title: "confirm your account",
        pagina: "Your account is now confirmed",
    });
};
exports.pugTest1 = pugTest1;
const pugTest2 = (req, res) => {
    res.render("auth/reset_password", {
        title: "Reset your password",
        pagina: "Reset your password",
    });
};
exports.pugTest2 = pugTest2;
const pugTest3 = (req, res) => {
    res.render("auth/set_new_password", {
        title: "Reset your password",
        pagina: "Reset your password",
    });
};
exports.pugTest3 = pugTest3;
