/* eslint-disable prettier/prettier */
const { check } = require("express-validator");

const username = () =>
  check("username")
    .not()
    .isEmpty()
    .isLength({ min: 5, max: 23 })
    .withMessage("Le nom d'utilisateur n'est pas au bon format")
    .trim()
    .escape();

const password = () =>
  check("password")
    .not()
    .isEmpty()
    .withMessage("Le mot de passe ne peut pas être vide.")
    .matches(/[A-Z]+/)
    .withMessage(
      "Le mot de passe doit comporter au minimum une lettre majuscule."
    )
    .matches(/[a-z]+/)
    .withMessage(
      "Le mot de passe doit comporter au minimum une lettre minuscule."
    )
    .matches(/[0-9]+/)
    .withMessage("Le mot de passe doit comporter au minimum un chiffre.")
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) // Pas besoin de retirer certains paramètres parce que le mot de passe est hashé dans la bdd, shesh les injections
    .withMessage(
      "Le mot de passe doit comporter au minimum un caractère spécial."
    )
    .isLength({ min: 6 })
    .withMessage("Le mot de passe est trop petit, 8 mini.")
    .isLength({ max: 40 })
    .withMessage("Le mot de passe est trop grand, 40 maxi.");

const userID = () =>
  check("userID")
    .not()
    .isEmpty()
    .withMessage("Le champ userID ne peut pas être vide.")
    .isInt()
    .withMessage("Le champ userID doit être un entier.")
    .trim()
    .escape();

const name = () =>
  check("name")
    .not()
    .isEmpty()
    .withMessage("Le champ nom ne peut pas être vide.")
    .isLength({ min: 2, max: 50 })
    .withMessage("Le nom doit comporter entre 2 et 50 caractères.")
    .trim()
    .escape();

const siret = () =>
  check("siret")
    .not()
    .isEmpty()
    .withMessage("Le champ siret ne peut pas être vide.")
    .matches(/[0-9]{14}/)
    .withMessage("Le siret doit comporter 14 chiffres.")
    .trim()
    .escape();

const sirene = () =>
  check("sirene")
    .not()
    .isEmpty()
    .withMessage("Le champ sirene ne peut pas être vide.")
    .matches(/[0-9]{9}/)
    .withMessage("Le sirene doit comporter 9 chiffres.")
    .trim()
    .escape();

const address = () =>
  check("address")
    .not()
    .isEmpty()
    .withMessage("Le champ adresse ne peut pas être vide.")
    .isString()
    .withMessage("Le champ adresse doit être une chaîne de caractères.")
    .trim()
    .escape();

const phone = () =>
  check("phone")
    .not()
    .isEmpty()
    .withMessage("Le champ téléphone ne peut pas être vide.")
    .isMobilePhone()
    .withMessage("Le numéro de téléphone n'est pas au bon format.")
    .trim()
    .escape();

const mail = () =>
  check("mail")
    .not()
    .isEmpty()
    .withMessage("Le champ mail ne peut pas être vide.")
    .isEmail()
    .withMessage("Le mail n'est pas au bon format.")
    .trim()
    .escape();

const token = () =>
  check("token")
    .not()
    .isEmpty()
    .withMessage("Le champ token ne peut pas être vide.")
    .isString()
    .withMessage("Le champ token doit être une chaîne de caractères.")
    .trim()
    .escape();

module.exports = {
  username,
  password,
  userID,
  name,
  siret,
  sirene,
  address,
  phone,
  mail,
  token,
};
