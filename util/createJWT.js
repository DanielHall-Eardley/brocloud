const jwt = require("jsonwebtoken");
const jwtSecret = require("crypto").randomBytes(256).toString("base64");

function createJWT(userId, cb) {
  // Create token with userId as payload
  jwt.sign({ id: userId }, jwtSecret, { expiresIn: "7d" }, (err, token) => {
    if (err) {
      return throwError("Unable to generate token", 500);
    }

    // Execute the rest of the endpoint logic in the callback
    cb(token);
  });
}

exports.createJWT = createJWT;
