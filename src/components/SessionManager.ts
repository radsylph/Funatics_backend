import { Request, Response } from "express";
import { Usuario, Tweet, Like, Follow } from "../models/main";
import bcrypt from "bcrypt";

import { generateToken1, generateJWT } from "../helpers/generateToken.js";
import { emailRegistro, emailReset } from "../helpers/mails.js";
import { check, validationResult } from "express-validator";
import verifyPassword from "../helpers/passtest.js";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: any;
}

class SessionManager {
  constructor() {}

  async createUser(req: Request, res: Response): Promise<Response> {
    const {
      name,
      lastname,
      username,
      email,
      password,
      repeat_password,
      profilePicture,
      bio,
    } = req.body;
    await check("name").notEmpty().withMessage("Name is required").run(req);
    await check("lastname")
      .notEmpty()
      .withMessage("Lastname is required")
      .run(req);
    await check("username")
      .notEmpty()
      .withMessage("Username is required")
      .run(req);
    await check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid")
      .run(req);
    await check("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .run(req);
    await check("repeat_password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .equals(password)
      .withMessage("the passwords doesn't match")
      .run(req);
    await check("bio")
      .optional()
      .isLength({ max: 100 })
      .withMessage("the bio is too large")
      .run(req);

    let result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: "you have these errors",
        errors: result.array(),
      });
    }
    console.log(req.body);
    try {
      console.log(req.body);

      const ExisteUsuario = await Usuario.findOne({ email: email }).exec();
      const existeUsername = await Usuario.findOne({
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

      const usuario = new Usuario({
        name,
        lastname,
        email,
        username,
        password,
        token: generateToken1(),
        confirmado: false,
        profilePicture,
        bio,
      });

      await usuario.save();

      emailRegistro({
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
    } catch (error) {
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
  }

  async verifyUser(req: Request, res: Response): Promise<void> {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ token: token }).exec();
    console.log(token);
    if (!usuario) {
      return res.render("auth/confirm_account", {
        pagina: "Authentication error",
        mensaje:
          "There has been an error when trying to confirm your account, try again",
        error: true,
      });
    }

    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    return res.render("auth/confirm_account", {
      pagina: "Account confirmed",
      mensaje:
        "Your account has been successfully confirmed, you can now log in !",
      error: false,
    });
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    await check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid")
      .run(req);

    let result = validationResult(req);
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

    const usuario = await Usuario.findOne({ email: email }).exec();
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

    usuario.token = generateToken1();
    await usuario.save();
    emailReset({
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
  }

  async checkResetPassword(req: Request, res: Response): Promise<void> {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ token: token }).exec();

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
  }

  async verifyNewPassword(req: Request, res: Response): Promise<Response> {
    const { token } = req.params;
    const { password } = req.body;
    await check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .notEmpty()
      .withMessage("Password is required")
      .run(req);
    await check("repeat_password")
      .equals(password)
      .withMessage("the passwords doesn't match")
      .run(req);

    let result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: "there was these errors",
        error: result.array(),
      });
    }

    const usuario = await Usuario.findOne({ token: token }).exec();
    if (!usuario) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    usuario.password = password;
    usuario.token = null;
    await usuario.save();
    return res.status(200).json({
      message: "Contraseña cambiada",
    });
  }

  async loginVerify(req: Request, res: Response): Promise<Response> {
    await check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid")
      .run(req);
    await check("password")
      .notEmpty()
      .withMessage("Password is required")
      .run(req);
    let result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: "there was these errors",
        errors: result.array(),
      });
    }

    return res.status(200).json({
      message: "Loggin succesfull",
    });
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { user_info, password } = req.body;
    await check("user_info")
      .notEmpty()
      .withMessage("Email or username is required")
      .run(req);
    await check("password")
      .notEmpty()
      .withMessage("Password is required")
      .run(req);

    let result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: "there was these errors",
        error: result.array(),
      });
    }
    const usuario = await Usuario.findOne({
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

    const passwordMatch = await verifyPassword(password, user_info);
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

    const token = generateJWT(usuario.id);
    console.log(usuario.id);
    // storeToken(token);
    return res.status(200).json({
      message: "Usuario logeado",
      token: token,
    });
  }

  closeSession(req: Request, res: Response): Response {
    return res.status(200).json({
      message: "Sesion cerrada",
    });
  }

  async getUser(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const user = await Usuario.findById(req.user.id).exec();
      console.log(user);
      return res.status(200).json({
        message: "User found",
        user: user,
      });
    } catch (error) {
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
  }

  async getAuser(req: CustomRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const user = await Usuario.findOne({ _id: id }).exec();

      if (!user) {
        return res.status(404).json({
          message: "User not found",
          errors: [
            {
              type: "field",
              value: id,
              msg: "the user doesn't exist",
              path: "id",
              location: "params",
            },
          ],
        });
      }

      const follow = await Follow.findOne({
        personToFollow: id,
        personThatFollows: req.user.id,
      }).exec();
      if (follow) {
        const followWithIsFollowed = follow.toObject();
        followWithIsFollowed.isFollowing = true;
        return res.status(200).json({
          message: "User found",
          user: user,
          follow: followWithIsFollowed,
        });
      }
      return res.status(200).json({
        message: "User found",
        user: user,
        follow: {
          isFollowing: false,
        },
      });
    } catch (error) {
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
  }

  async editUser(req: CustomRequest, res: Response): Promise<Response> {
    await check("name").notEmpty().withMessage("Name is required").run(req);
    await check("lastname")
      .notEmpty()
      .withMessage("Lastname is required")
      .run(req);
    await check("username")
      .notEmpty()
      .withMessage("Username is required")
      .run(req);
    await check("profilePicture").optional().run(req);
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: "there was these errors",
        error: result.array(),
      });
    }
    const { name, lastname, username, profilePicture } = req.body;
    try {
      const Username = await Usuario.findOne({
        username: username,
      }).exec();
      const myusername = await Usuario.findById(req.user.id).exec();
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
      const user = await Usuario.findById(req.user.id).exec();
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
      user.profilePicture = profilePicture;
      await user.save();
      return res.status(200).json({
        message: "User edited",
        user: user,
      });
    } catch (error) {
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
  }

  async deleteUser(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const user = await Usuario.findByIdAndDelete(req.user.id).exec();
      const tweets = await Tweet.find({ owner: req.user.id }).exec();
      const likes = await Like.find({ owner: req.user.id }).exec();
      const follows = await Follow.find({
        $or: [
          { personToFollow: req.user.id },
          { personThatFollows: req.user.id },
        ],
      }).exec();

      if (!user) {
        return res.status(404).json({
          message: "User not found",
          errors: [
            {
              type: "field",
              value: req.user.id,
              msg: "the user doesn't exist",
              path: "id",
              location: "params",
            },
          ],
        });
      }
      await Tweet.deleteMany({ owner: req.user.id }).exec();
      for (const like of likes) {
        const tweetId = like.tweet;
        await Tweet.findByIdAndUpdate(tweetId, { $inc: { likes: -1 } }).exec();
        await Like.findByIdAndDelete(like.id).exec();
      }
      for (const follow of follows) {
        const personToFollowId = follow.personToFollow;
        await Usuario.findByIdAndUpdate(personToFollowId, {
          $inc: { followers: -1 },
        }).exec();
        await Follow.findByIdAndDelete(follow.id).exec();
      }
      for (const tweet of tweets) {
        await Tweet.findByIdAndDelete(tweet.id).exec();
      }
      return res.status(200).json({
        message: "User deleted",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "there was these errors",
        errors: [
          {
            type: "server",
            value: "",
            msg: "there was an error when deleting the user",
            path: "",
            location: "",
          },
        ],
      });
    }
  }
}

export { SessionManager };
