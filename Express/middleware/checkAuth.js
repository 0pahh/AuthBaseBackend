const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.split(" ")[1];

      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            return res
              .status(401)
              .json({ error: true, message: "Accès non autorisé" });
          }

          const { userID } = decoded;
          if (
            (req.body.userID && req.body.userID !== userID) ||
            (req.query.userID && req.query.userID !== userID) ||
            (req.params.userID && req.params.userID !== userID)
          ) {
            throw new Error("User ID mauvais");
          }

          req.auth = { userID };
          next();
        });
      } else {
        res.status(403).send({ error: true, message: "Pas de token fourni." });
      }
    } else {
      res.status(403).send({ error: true, message: "Pas de token fourni." });
    }
  } catch (error) {
    res.status(401).send({ error: "Erreur d'authentification" });
  }
};
