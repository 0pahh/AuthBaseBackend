const { userID, address, phone, mail } = require("./fields");

exports.checkJWTValidator = [userID()];

exports.changePhoneNumberValidator = [userID(), phone()];

exports.changeMailValidator = [userID(), mail()];

exports.changeAddressValidator = [userID(), address()];

exports.invalidateTokensValidator = [userID()];
