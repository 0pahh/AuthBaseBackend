const redis = require("redis");
require("dotenv").config();

const client = redis.createClient({
  socket: {
    host: "localhost", // redis in the same server
    port: 6379,
  },
  password: process.env.REDIS_PWD,
});
client
  .connect()
  .then(async () => {
    console.log("Connected to redis JWT storage");
  })
  .catch((err) => {
    console.log("error connecting to redis JWT storage: ", err.message);
  });

exports.client = client;
