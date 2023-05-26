const express = require("express");

const router = express.Router();
const authCtrl = require("../controllers/auth");

const {
  loginValidator,
  signupValidator,
  sendPasswordResetMailValidator,
  resetPasswordValidator,
  checkResetTokenValidator,
} = require("../validators/auth");

router.post("/login", loginValidator, authCtrl.login);
router.post("/signup", signupValidator, authCtrl.signup);
router.post(
  "/send-pwd-reset-mail",
  sendPasswordResetMailValidator,
  authCtrl.sendPasswordResetMail
);
router.get(
  "/check-reset-token/:token",
  checkResetTokenValidator,
  authCtrl.checkResetToken
);
router.post("/reset-password", resetPasswordValidator, authCtrl.resetPassword);

module.exports = router;
