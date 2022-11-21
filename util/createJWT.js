const jwt = require("jsonwebtoken");
const jwtSecret = require("crypto").randomBytes(256).toString("base64");
const throwError = require("./throwError");

async function createJWT(userId) {
  try {
    const token = await jwt.sign({ id: userId }, jwtSecret, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    throwError(error, 401);
  }
}

exports.createJWT = createJWT;
exports.secret = jwtSecret;
