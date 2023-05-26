const express = require("express");

const router = express.Router();
const usersCtrl = require("../controllers/users");

const checkAuth = require("../middleware/checkAuth");
const {
  checkJWTValidator,
  changePhoneNumberValidator,
  changeMailValidator,
  changeAddressValidator,
  invalidateTokensValidator,
} = require("../validators/users");

router.get("/", (req, res) => {
  res.status(204).json({ message: "Il n'y a rien ici" });
});

router.get("/:userID/check-jwt", checkJWTValidator, usersCtrl.checkJWT);
router.patch(
  "/:userID/phone-number",
  changePhoneNumberValidator,
  checkAuth,
  usersCtrl.changePhoneNumber
);
router.patch(
  "/:userID/mail",
  changeMailValidator,
  checkAuth,
  usersCtrl.changeMail
);
router.patch(
  "/:userID/address",
  changeAddressValidator,
  checkAuth,
  usersCtrl.changeAddress
);
router.delete(
  "/invalidate-tokens",
  checkAuth,
  invalidateTokensValidator,
  usersCtrl.invalidateTokens
);

module.exports = router;
