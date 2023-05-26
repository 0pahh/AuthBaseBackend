const db = require("../db");
const jwt = require("jsonwebtoken"); // Pour envoyer les mails de reset de mot de passe
const { validationResult } = require("express-validator"); // Pour vérifier les données reçues
const { client } = require("../redis"); // Pour acceder aux tokens JWT dans Redis

exports.changePhoneNumber = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { phone } = req.body;
  const { userID } = req.params;

  db.pool
    .query("UPDATE Users SET phone = ? WHERE ID = ?", [phone, userID])
    .then((lines) => {
      if (lines.affectedRows === 1) {
        return res.status(201).send({ message: "Numéro de téléphone changé" });
      }

      return res.status(404).send({ error: "Utilisateur non trouvé" });
    })
    .catch((err) => {
      return res.status(500).send({ error: "Erreur inconnue" });
    });

  return undefined;
};

exports.changeMail = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { mail } = req.body;
  const { userID } = req.params;
  db.pool
    .query("UPDATE Users SET mail = ? WHERE ID = ?", [mail, userID])
    .then((lines) => {
      if (lines.affectedRows === 1) {
        return res.status(201).send({ message: "Mail changé" });
      }

      return res.status(404).send({ error: "Utilisateur non trouvé" });
    })
    .catch((err) => {
      return res.status(500).send({ error: "Erreur inconnue" });
    });

  return undefined;
};

exports.changeAddress = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { address } = req.body;
  const { userID } = req.params;

  db.pool
    .query("UPDATE Users SET address = ? WHERE ID = ?", [address, userID])
    .then((lines) => {
      if (lines.affectedRows === 1) {
        return res.status(201).send({ message: "Adresse changée" });
      }

      return res.status(404).send({ error: "Utilisateur non trouvé" });
    })
    .catch((err) => {
      return res.status(500).send({ error: "Erreur inconnue" });
    });

  return undefined;
};

exports.checkJWT = (req, res, next) => {
  const errors = validationResult(req.params);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const { userID } = req.params;
  jwt.verify(
    req.headers.authorization.split(" ")[1],
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) return res.status(401).send({ error: "Token invalide" });
      if (+decoded.userID === +userID) {
        return res.status(200).send({ message: "Token valide" });
      }
      return res.status(401).send({ error: "Token invalide" });

      return undefined;
    }
  );
};

exports.invalidateTokens = async (req, res) => {
  const errors = validationResult(req.query);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { userID } = req.query;

  if (client) {
    await client
      .del(userID)
      .then(() => {
        res.status(200).send({
          success: "Tokens invalidés avec succès",
        });
      })
      .catch((err) => {
        return res.status(500).send({ error: "Erreur interne" });
      });
  } else res.status(503).send({ error: "Redis non connecté" });
};
