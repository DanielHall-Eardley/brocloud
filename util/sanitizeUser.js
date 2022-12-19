function sanitizeUser(user) {
  const sanitizedUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    nickName: user.nickName,
    clubId: user.clubId,
    active: user.active,
    _id: user._id,
  };

  return sanitizedUser;
}

module.exports = sanitizeUser;
