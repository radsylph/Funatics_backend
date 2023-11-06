"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
const Usuario_js_1 = __importDefault(require("../models/Usuario.js"));
const generateToken_js_1 = require("../helpers/generateToken.js");
const mails_js_1 = require("../helpers/mails.js");
const express_validator_1 = require("express-validator");
const passtest_js_1 = __importDefault(require("../helpers/passtest.js"));
class SessionManager {
    constructor() { }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, lastname, username, email, password, repeat_password } = req.body;
            yield (0, express_validator_1.check)("name").notEmpty().withMessage("Name is required").run(req);
            yield (0, express_validator_1.check)("lastname")
                .notEmpty()
                .withMessage("Lastname is required")
                .run(req);
            yield (0, express_validator_1.check)("username")
                .notEmpty()
                .withMessage("Username is required")
                .run(req);
            yield (0, express_validator_1.check)("email")
                .notEmpty()
                .withMessage("Email is required")
                .isEmail()
                .withMessage("Email is not valid")
                .run(req);
            yield (0, express_validator_1.check)("password")
                .notEmpty()
                .withMessage("Password is required")
                .isLength({ min: 6 })
                .withMessage("Password must be at least 6 characters long")
                .run(req);
            yield (0, express_validator_1.check)("repeat_password")
                .notEmpty()
                .withMessage("Password is required")
                .isLength({ min: 6 })
                .withMessage("Password must be at least 6 characters long")
                .equals(password)
                .withMessage("the passwords doesn't match")
                .run(req);
            let result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "you have these errors",
                    errors: result.array(),
                });
            }
            console.log(req.body);
            try {
                console.log(req.body);
                const ExisteUsuario = yield Usuario_js_1.default.findOne({ email: email }).exec();
                const existeUsername = yield Usuario_js_1.default.findOne({
                    username: username,
                }).exec();
                if (existeUsername) {
                    return res.status(400).json({
                        message: "there was these errors",
                        errors: [
                            {
                                type: "field",
                                value: username,
                                msg: "the username is already registered",
                                path: "username",
                                location: "body",
                            },
                        ],
                    });
                }
                if (ExisteUsuario) {
                    return res.status(400).json({
                        message: "there was these errors",
                        errors: [
                            {
                                type: "field",
                                value: email,
                                msg: "the email is already registered",
                                path: "email",
                                location: "body",
                            },
                        ],
                    });
                }
                const usuario = new Usuario_js_1.default({
                    name,
                    lastname,
                    email,
                    username,
                    password,
                    token: (0, generateToken_js_1.generateToken1)(),
                    confirmado: false,
                });
                yield usuario.save();
                (0, mails_js_1.emailRegistro)({
                    email: usuario.email,
                    nombre: usuario.name,
                    token: usuario.token,
                });
                return res.status(200).json({
                    message: "User created",
                    error: [
                        {
                            type: "server",
                            value: "",
                            msg: "User created",
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "User not created",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when creating the user",
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    verifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params;
            const usuario = yield Usuario_js_1.default.findOne({ token: token }).exec();
            console.log(token);
            if (!usuario) {
                return res.render("auth/confirm_account", {
                    pagina: "Authentication error",
                    mensaje: "There has been an error when trying to confirm your account, try again",
                    error: true,
                });
            }
            usuario.token = null;
            usuario.confirmado = true;
            yield usuario.save();
            return res.render("auth/confirm_account", {
                pagina: "Account confirmed",
                mensaje: "Your account has been successfully confirmed, you can now log in !",
                error: false,
            });
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            yield (0, express_validator_1.check)("email")
                .notEmpty()
                .withMessage("Email is required")
                .isEmail()
                .withMessage("Email is not valid")
                .run(req);
            let result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "Error al crear el usuario",
                    errors: result.array(),
                });
            }
            // if (!result.isEmpty()) {
            //   return res.render("auth/reset_password", {
            //     pagina: "Reset Password",
            //     errores: result.array(),
            //     usuario: {
            //       email: email,
            //     },
            //   });
            // }
            const usuario = yield Usuario_js_1.default.findOne({ email: email }).exec();
            // if (!usuario) {
            //   return res.render("auth/reset_password", {
            //     pagina: "Reset Password",
            //     serrores: [
            //       {
            //         msg: "The email is not registered",
            //       },
            //     ],
            //     usuario: {
            //       email: email,
            //     },
            //   });
            // }
            if (!usuario) {
                return res.status(400).json({
                    message: "there was these errors",
                    error: [
                        {
                            type: "field",
                            value: email,
                            msg: "the email is not registered",
                            path: "email",
                            location: "body",
                        },
                    ],
                });
            }
            usuario.token = (0, generateToken_js_1.generateToken1)();
            yield usuario.save();
            (0, mails_js_1.emailReset)({
                email: usuario.email,
                nombre: usuario.name,
                token: usuario.token,
            });
            return res.status(200).json({
                message: "we have send an mail to your email",
            });
            // res.render("templates/mensajes", {
            //   pagina: "Reset Password",
            //   mensaje: "we have send a mail to your email",
            // });
        });
    }
    checkResetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params;
            const usuario = yield Usuario_js_1.default.findOne({ token: token }).exec();
            if (!usuario) {
                return res.render("auth/reset_password", {
                    pagina: "Reset Password",
                    errores: [
                        {
                            msg: "The email is not registered",
                        },
                    ],
                });
            }
            res.render("auth/set_new_password", {
                pagina: "Set new password",
            });
        });
    }
    verifyNewPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params;
            const { password } = req.body;
            yield (0, express_validator_1.check)("password")
                .isLength({ min: 6 })
                .withMessage("Password must be at least 6 characters long")
                .notEmpty()
                .withMessage("Password is required")
                .run(req);
            yield (0, express_validator_1.check)("repeat_password")
                .equals(password)
                .withMessage("the passwords doesn't match")
                .run(req);
            let result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "there was these errors",
                    error: result.array(),
                });
            }
            const usuario = yield Usuario_js_1.default.findOne({ token: token }).exec();
            if (!usuario) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            usuario.password = password;
            usuario.token = null;
            yield usuario.save();
            return res.status(200).json({
                message: "Contraseña cambiada",
            });
        });
    }
    loginVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, express_validator_1.check)("email")
                .notEmpty()
                .withMessage("Email is required")
                .isEmail()
                .withMessage("Email is not valid")
                .run(req);
            yield (0, express_validator_1.check)("password")
                .notEmpty()
                .withMessage("Password is required")
                .run(req);
            let result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "there was these errors",
                    errors: result.array(),
                });
            }
            return res.status(200).json({
                message: "Loggin succesfull",
            });
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_info, password } = req.body;
            yield (0, express_validator_1.check)("user_info")
                .notEmpty()
                .withMessage("Email or username is required")
                .run(req);
            yield (0, express_validator_1.check)("password")
                .notEmpty()
                .withMessage("Password is required")
                .run(req);
            let result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "there was these errors",
                    error: result.array(),
                });
            }
            const usuario = yield Usuario_js_1.default.findOne({
                $or: [{ email: user_info }, { username: user_info }],
            }).exec();
            if (!usuario) {
                return res.status(400).json({
                    message: "there was these errors",
                    errors: [
                        {
                            type: "field",
                            value: "",
                            msg: "the user doesn't exist",
                            path: "user_info",
                            location: "body",
                        },
                    ],
                });
            }
            if (!usuario.confirmado) {
                return res.status(400).json({
                    message: "there was these errors",
                    errors: [
                        {
                            type: "field",
                            value: user_info,
                            msg: "the user isn't confirmed",
                            path: "user_info",
                            location: "body",
                        },
                    ],
                });
            }
            const passwordMatch = yield (0, passtest_js_1.default)(password, user_info);
            console.log(passwordMatch);
            if (!passwordMatch) {
                return res.status(400).json({
                    message: "there was these errors",
                    errors: [
                        {
                            type: "field",
                            value: password,
                            msg: "the password is incorrect",
                            path: "password",
                            location: "body",
                        },
                    ],
                });
            }
            const token = (0, generateToken_js_1.generateJWT)(usuario.id);
            console.log(usuario.id);
            // storeToken(token);
            return res.status(200).json({
                message: "Usuario logeado",
                token: token,
            });
        });
    }
    closeSession(req, res) {
        return res.status(200).json({
            message: "Sesion cerrada",
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield Usuario_js_1.default.findById(req.user.id).exec();
                console.log(user);
                return res.status(200).json({
                    message: "User found",
                    user: user,
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "there was these errors",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when getting the user",
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, express_validator_1.check)("name").notEmpty().withMessage("Name is required").run(req);
            yield (0, express_validator_1.check)("lastname")
                .notEmpty()
                .withMessage("Lastname is required")
                .run(req);
            yield (0, express_validator_1.check)("username")
                .notEmpty()
                .withMessage("Username is required")
                .run(req);
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "there was these errors",
                    error: result.array(),
                });
            }
            const { name, lastname, username } = req.body;
            try {
                const Username = yield Usuario_js_1.default.findOne({
                    username: username,
                }).exec();
                const myusername = yield Usuario_js_1.default.findById(req.user.id).exec();
                if (myusername === null) {
                    return res.status(400).json({
                        message: "there was these errors",
                        errors: [
                            {
                                type: "field",
                                value: username,
                                msg: "the username is null",
                                path: "username",
                                location: "body",
                            },
                        ],
                    });
                }
                if (Username && Username.username !== myusername.username) {
                    return res.status(400).json({
                        message: "there was these errors",
                        errors: [
                            {
                                type: "field",
                                value: username,
                                msg: "the username is already registered",
                                path: "username",
                                location: "body",
                            },
                        ],
                    });
                }
                const user = yield Usuario_js_1.default.findById(req.user.id).exec();
                if (user === null) {
                    return res.status(400).json({
                        message: "there was these errors",
                        errors: [
                            {
                                type: "field",
                                value: username,
                                msg: "the user is null",
                                path: "user",
                                location: "body",
                            },
                        ],
                    });
                }
                user.name = name;
                user.lastname = lastname;
                user.username = username;
                yield user.save();
                return res.status(200).json({
                    message: "User edited",
                    user: user,
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "there was these errors",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when editing the user",
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
}
exports.SessionManager = SessionManager;
