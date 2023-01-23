const { isLength } = require("validator");

function validateUser(user) {
  const keys = Object.keys(user);

  for (let key of keys) {
    const string = user[key];
    const stringLength = isLength(string, { min: 3 });
    if (!stringLength) {
      return `Enter a valid ${key}`;
    }
  }

  return null;
}

module.exports = validateUser;
