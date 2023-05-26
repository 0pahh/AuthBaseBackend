const {
  username,
  password,
  name,
  siret,
  sirene,
  address,
  phone,
  mail,
  token,
} = require("./fields");

exports.loginValidator = [username(), password()];

exports.signupValidator = [
  username(),
  password(),
  name(),
  siret(),
  sirene(),
  address(),
  phone(),
  mail(),
];

exports.sendPasswordResetMailValidator = [mail()];
exports.checkResetTokenValidator = [token()];
exports.resetPasswordValidator = [token(), password()];
