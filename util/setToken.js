function setToken(token, res) {
  res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
}

module.exports = setToken;
