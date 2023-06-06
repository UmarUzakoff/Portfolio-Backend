const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const verify = (payload) => jwt.verify(payload, SECRET_KEY);
const sign = (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

module.exports = {
  sign,
  verify,
};