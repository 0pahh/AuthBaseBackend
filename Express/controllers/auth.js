const db = require("../db");
const bcrypt = require("bcrypt"); // Pour générer et lire les mots de passes hashés et salés
const jwt = require("jsonwebtoken"); // Pour envoyer les mails de reset de mot de passe
const { validationResult } = require("express-validator"); // Pour vérifier les données reçues
const { client } = require("../redis"); // Pour acceder aux tokens JWT dans Redis

exports.login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { username, password } = req.body;

  await db.pool
    .query(
      "SELECT nom, ID as userID, password, name, siret, sirene, address, phone, mail, lastConnection, creationDate, lastPasswordUpdate  FROM Users WHERE ID = ?",
      [username]
    )
    .then((user) => {
      delete user.meta;
      if (Object.keys(user).length === 0)
        return res
          .status(401)
          .send({ warning: "Email et/ou mot de passe incorrect" });
      if (Object.keys(user).length > 1)
        return res.status(500).send({ error: "Erreur inconnue" });

      bcrypt
        .compare(password, user[0].password)
        .then(async (good) => {
          if (!good) {
            return res
              .status(401)
              .send({ warning: "Email et/ou mot de passe incorrect" });
          }
          const accessToken = jwt.sign(
            {
              userID: user[0].userID,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_ACCESS_EXPIRATION,
            }
          );

          const {
            userID,
            username,
            name,
            siret,
            sirene,
            address,
            phone,
            mail,
            lastConnection,
            creationDate,
            lastPasswordUpdate,
          } = user[0];

          try {
            const existingData = await client.get(user[0].userID);

            let validTokenArray = [];
            if (existingData) {
              validTokenArray = JSON.parse(existingData).filter(
                (existingToken) => {
                  try {
                    const decoded = jwt.verify(
                      existingToken,
                      process.env.JWT_SECRET
                    );
                    return decoded != null;
                  } catch (err) {
                    return false;
                  }
                }
              );
            }

            await client.set(user[0].userID, JSON.stringify(validTokenArray));

            // set the lastConnection date
            await db.pool
              .query("UPDATE Users SET lastConnection = NOW() WHERE ID = ?", [
                userID,
              ])
              .then(() => {
                return res.status(200).send({
                  user: {
                    id: userID,
                    username,
                    name,
                    siret,
                    sirene,
                    address,
                    phone,
                    mail,
                    lastConnection,
                    creationDate,
                    lastPasswordUpdate,
                  },
                  accessToken,
                });
              })
              .catch(() => {
                return res.status(200).send({
                  user: {
                    id: userID,
                    username,
                    name,
                    siret,
                    sirene,
                    address,
                    phone,
                    mail,
                    lastConnection,
                    creationDate,
                    lastPasswordUpdate,
                  },
                  accessToken,
                });
              });
          } catch (err) {
            console.error("Error fetching existing data:", err);
            return res.status(200).send({
              user: {
                id: userID,
                username,
                name,
                siret,
                sirene,
                address,
                phone,
                mail,
              },
              accessToken,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).send({ error: "Erreur inconnue" });
        });
      return undefined;
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ error: "Erreur inconnue" });
    });
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { username, password, siret, sirene, address, phone, mail, name } =
    req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPWD) => {
      db.pool
        .query(
          "INSERT INTO Users (userName, password, name, siret, sirene, address, phone, email, CreationDate ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW()) ",
          [username, hashedPWD, name, siret, sirene, address, phone, mail]
        )
        .then((lines) => {
          if (lines.affectedRows === 1) {
            return res.status(201).send({ message: "Compte créé" });
          }
          return res.status(500).send({ error: "Erreur" });
        })
        .catch((err) => {
          return res.status(500).send({ error: "Erreur" });
        });
    })
    .catch((err) => {
      return res.status(500).send({ error: "Erreur" });
    });
  return undefined;
};

exports.sendPasswordResetMail = async (req, res) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { mail } = req.body;
  await db.pool
    .query("SELECT mail FROM Users WHERE mail = ? LIMIT 1", [mail])
    .then((user) => {
      delete user.meta;
      if (Object.keys(user).length === 0) {
        return res.status(200).send({
          ok: "Envoi réussi", // Renvoie quand même un statut 200  pour éviter de donner des infos sur les utilisateurs
        });
      }
      const { userID } = user[0];
      const resetToken = crypto.randomBytes(64).toString("hex"); // Génére un token random pour le changement de mdp, 16 char random au format string

      db.pool
        .query(
          `
          INSERT INTO
          ResetTokens (token, ID_Users, expiration)
          VALUES
            (
              ?,
              ?,
              DATE_ADD(NOW(), INTERVAL 3 HOUR)
            )

          `,
          [resetToken, userID]
        ) // Envoie tout ca dans la bdd
        .then(() => {
          const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PWD,
            },
          });

          const mailOptions = {
            to: email, // Mail de l'utilisateur, remplacer par la var email
            from: process.env.MAIL_USER,
            subject: "Requête de changement mot de passe",
            text:
              `Vous recevez cet e-mail car vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.\n\n` +
              `Veuillez cliquer sur le lien suivant, ou le coller dans votre navigateur pour terminer la procédure:\n\n` +
              `https://todo/${resetToken}\n\n` + // rajoute le token au lien du frontend pour qu'il l'utilise pour les appels http checkResetToken et resetPassword
              `Si vous n'avez pas demandé un changement de mot de passe, veuillez ignorer cet e-mail et votre mot de passe restera inchangé.\n`,
          };

          transporter
            .sendMail(mailOptions)
            .then(() => {
              res.status(200).send({
                success: "Envoi réussi",
              });
            })
            .catch(() =>
              res.status(500).send({
                error: "Erreur interne",
              })
            );
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).send({
            error: "Erreur interne",
          });
        });
      return undefined;
    })
    .catch(() => {
      res.status(500).send({
        error: "Erreur", // Renvoie un statut 500 si la requête d'insertion de token a échouée, error dans la console au cas ou.
      });
    });
  return undefined;
};

exports.checkResetToken = async (req, res) => {
  const errors = validationResult(req.params);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { token } = req.params;

  await db.pool
    .query(
      `SELECT token, expiration FROM resettokens WHERE token = ? LIMIT 1`,
      [token]
    )
    .then((token) => {
      delete token.meta;
      if (
        Object.keys(token).length === 0 ||
        new Date(token[0].expiration) < Date.now()
      ) {
        return res.status(401).send({
          warning: "Token expiré ou invalide",
        });
      }
      return res
        .status(200)
        .send({
          success: "Le token est valide.",
        })
        .catch(() =>
          res.status(500).json({
            error: "Erreur interne",
          })
        );
      return undefined;
    });
};

exports.resetPassword = async (req, res) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { token, password } = req.body;
  await db.pool
    .query(
      "SELECT token, ID_Users as userID FROM ResetTokens WHERE token = ? LIMIT 1",
      [token]
    )
    .then((token) => {
      delete token.meta; // Retire les metadonnées du résultat de la requête sql
      if (Object.keys(token).length === 0)
        return res
          .status(401)
          .send({ error: "Le token a expiré ou n'existe pas" });
      db.pool
        .query(
          "SELECT ID AS userID, password FROM Users WHERE ID = ? LIMIT 1",
          [token[0].userID]
        )
        .then((user) => {
          delete user.meta; // Retire les metadonnées du résultat de la requête sql
          if (Object.keys(user).length === 0)
            // Si la requête ne renvoie rien, on part du principe que l'utilisateur n'existe pas
            return res
              .status(404)
              .send({ error: "L'utilisateur n'existe pas" });

          if (!bcrypt.compare(password, user[0].password))
            // Le mot de passe ne peut pas être identique a celui qui était déjà présent
            return res.status(400).send({
              error: "Le mot de passe ne peut pas être identique avec l'ancien",
            });

          bcrypt
            .hash(password, 10)
            .then((newpassword) => {
              db.pool
                .query(
                  `
                  BEGIN;
                  UPDATE Users SET password = ?, lastPasswordUpdate = NOW() WHERE ID = ?;
                  DELETE FROM ResetTokens WHERE token = ?;
                  COMMIT;`,
                  [newpassword, token[0].userID]
                )
                .then(() => {
                  if (client) {
                    client
                      .del(userID)
                      .then(() => {
                        res.status(201).send({
                          success: "Le mot de passe a été changé avec succès",
                        });
                      })
                      .catch((err) => {
                        res.status(201).send({
                          success: "Le mot de passe a été changé avec succès",
                        });
                      });
                  }
                  res.status(201).send({
                    success: "Le mot de passe a été changé avec succès",
                  });
                })
                .catch(() =>
                  res.status(400).send({
                    error: "Le mot de passe n'a pas pu être changé", // Renvoie un statut 400 avec l'erreur si la requête de changement de mot de passe a échouée
                  })
                );
            })
            .catch(() =>
              res.status(500).send({
                error: "Erreur interne",
              })
            );
          return undefined;
        })
        .catch(() => {
          return res.status(500).send({
            error: "Erreur interne",
          });
        });
      return undefined;
    })
    .catch(() => {
      return res.status(500).send({
        error: "Erreur interne",
      });
    });

  return undefined;
};
