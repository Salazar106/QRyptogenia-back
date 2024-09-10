import express from "express";
import {
  getUser,
  getImage,
  changeProfilePicture,
  changeUsername,
  changePassword,
  changeEmail,
  sendVerifyNewEmail,
  verifyAccountt,
  verifyNewEmail,
  AssignMembership
  
} from "../controllers/user/user.controller.js";

const router = express.Router();

router.get("/", getUser);
router.get("/get_image", getImage);
router.post("/change_picture", changeProfilePicture);
router.post("/change_username", changeUsername);
router.post("/change_password", changePassword);
router.post("/change-email", changeEmail);
router.post("/send-verify-new-email", sendVerifyNewEmail);
router.post("/verify-account", verifyAccountt);
router.post("/verify-new-email", verifyNewEmail);
router.post('/assign-membership', AssignMembership);


export default router;
