var mariadb = require("mariadb");
require("dotenv").config();

const pool = mariadb.createPool({
  //Gère la connexion a la bdd, !laisser les variables dans l'environment!
  host: process.env.MARIADB_HOST,
  port: process.env.MARIADB_PORT,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PWD,
  database: process.env.MARIADB_DB,
  multipleStatements: true, //Attention aux injections sql
  connectionLimit: 100,
});

module.exports = Object.freeze({
  //Nécessaire pour la sécurité
  pool: pool,
});
