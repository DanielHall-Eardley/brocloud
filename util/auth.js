const jwt = require("jsonwebtoken");
const { secret } = require("./createJWT");
const catchError = require("./catchError");

exports.authorizeAccess = catchError(async (req, res, next) => {
  const token = req.cookies.token;
  try {
    jwt.verify(token, secret);
  } catch (error) {
    // res.redirect("/login");
  }

  next();
});
