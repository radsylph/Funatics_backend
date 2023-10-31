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
exports.emailReset = exports.emailRegistro = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const emailRegistro = (datos) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.APP_USER,
            pass: process.env.APP_PASSWORD,
        },
    });
    console.log(datos);
    const { email, nombre, token } = datos;
    try {
        yield transport.sendMail({
            from: process.env.APP_USER,
            to: email,
            subject: "Confirm your account",
            html: `<!DOCTYPE html>
      <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com馃彚office">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="x-apple-disable-message-reformatting">
        <title></title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
        <style>
          table, td, div, h1, p {font-family: Arial, sans-serif;}
        </style>
      </head>
      <body style="margin:0;padding:0;">
        <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#E4EBEC;">
          <tr>
            <td align="center" style="padding:0;">
              <table role="presentation" style="with:602px;border-collapse:collapse;border:1px solid #0CA58A;border-spacing:0;text-align:left;">
                <tr>
                  <td align="center" style="padding:40px 0 30px 0;background: linear-gradient(25deg, #DFC592 0%, #0CA58A 100%);">
                    <a href="#"> <img src="https://i.postimg.cc/9QVpjXs8/2.png" alt="" width="200" style="height:auto;display:block;" /></a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:36px 30px 20px 30px; ">
                    <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                      <tr>
                        <td style="padding:0 0 0 0;color:#112E29;">
                          <h1 align="center" style="font-size:24px;margin:0 0 20px 0;font-family: Arial, sans-serif;color:#0CA58A;  font-size: 30px;">Verify your account </h1>
                          <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-weight: normal; font-family: arial,helvetica,sans-serif; font-size: 16px; color:#0CA58A;">
                            <div><strong>Use the following link to verify your account:<a href="${process.env.BACKEND_URL}/auth/confirm/${token}" style="font-size: 30px; margin:0 0 12px 0;font-size:16px;line-height:24px;font-family: Arial, sans-serif;color:#112E29;"> Verify your account</a>  </strong></div>
                          </h1>
                          <br>
                          <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family: Arial, sans-serif;color:#112E29;">if you didnt create this account, pls dont pay attention to this message</p>
                        </td>
                      </tr>
                    
                    </table>
                  </td>
                </tr>
               
          </table>
        </body>
        </html>`,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.emailRegistro = emailRegistro;
const emailReset = (datos) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.APP_USER,
            pass: process.env.APP_PASSWORD,
        },
    });
    const { email, nombre, token } = datos;
    try {
        yield transport.sendMail({
            from: "LuckyNotes@gmail.com",
            to: email,
            subject: "Reset your password",
            html: `<!DOCTYPE html>
      <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="x-apple-disable-message-reformatting">
        <title></title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
        <style>
          table, td, div, h1, p {font-family: Arial, sans-serif;}
        </style>
      </head>
      <body style="margin:0;padding:0;">
        <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#E4EBEC;">
          <tr>
            <td align="center" style="padding:0;">
              <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #0CA58A;border-spacing:0;text-align:left;">
                <tr>
                  <td align="center" style="padding:40px 0 30px 0;background: linear-gradient(25deg, #DFC592 0%, #0CA58A 100%);">
                    <a href="#"> <img src="https://i.postimg.cc/9QVpjXs8/2.png" alt="" width="200" style="height:auto;display:block;" /></a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:36px 30px 20px 30px;">
                    <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                      <tr>
                        <td style="padding:0 0 0 0;color:#112E29;">
                          <h1 align="center" style="font-size:24px;margin:0 0 20px 0;font-family: Arial, sans-serif;color:#0CA58A;">Reset your password</h1>
                          <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-weight: normal; font-family: arial,helvetica,sans-serif; font-size: 16px; color:#0CA58A;">
                            <div><strong>Use the following link to reset your password: <a href="${process.env.BACKEND_URL}/auth/reset_password/${token}" style="color:#112E29;">Reset your password</a></strong></div>
                          </h1>
                          <br>
                          <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family: Arial, sans-serif;color:#112E29;">If you didn't request a password reset, please ignore this message.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
       `,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.emailReset = emailReset;
