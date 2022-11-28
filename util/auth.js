const jwt = require("jsonwebtoken");
const { secret } = require("./createJWT");
const catchError = require("./catchError");

exports.authorizeAccess = catchError(async (req, res, next) => {
  const token = req.cookies.token;
  try {
    jwt.verify(token, secret);
  } catch (error) {
    console.log("jwt error", error);
    res.redirect("/login");
  }

  next();
});
