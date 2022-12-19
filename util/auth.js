const jwt = require("jsonwebtoken");
const { secret } = require("./createJWT");
const catchError = require("./catchError");
const updateActiveUser = require("./updateActiveUser");

exports.authorizeAccess = catchError(async (req, res, next) => {
  const token = req.cookies.token;
  try {
    jwt.verify(token, secret);
  } catch (error) {
    const decoded = jwt.decode(token, { complete: true });
    const userId = decoded.payload.id;
    updateActiveUser(userId, false);
    res.redirect("/login");
  }

  next();
});
