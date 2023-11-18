import express from "express";
import {
  createUser,
  createForm,
  confirmAccount,
  testingpug,
  formReset,
  resetPassword,
  newPassword,
  verifyPassword,
  login,
  pugTest1,
  pugTest2,
  pugTest3,
  getUser,
  editUser,
  getAuser,
  // deleteUser,
} from "../controllers/userControllers";
import getUserInfo from "../middlewares/ProtectRutes";

const router = express.Router();

router.route("/create").get(createForm).post(createUser);
router.route("/login").post(login);
router.route("/confirm/:token").get(confirmAccount);
router.route("/testingpug").get(testingpug);
router.route("/reset_password").get(formReset).post(resetPassword);
router.route("/reset_password/:token").get(verifyPassword).post(newPassword);
router.route("/getUser").get(getUserInfo, getUser);
router.route("/getUser/:id").get(getUserInfo, getAuser);

router.route("/editUser").put(getUserInfo, editUser);
// router.route("/deleteUser").delete(getUserInfo, deleteUser);
router.get("/pugtest1", pugTest1);
router.get("/pugtest2", pugTest2);
router.get("/pugtest3", pugTest3);

export default router;
