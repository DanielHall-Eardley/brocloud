const { updateDocument, dbConnection } = require("../util/setupUtil");
const User = dbConnection().collection("user");
const { ObjectID } = require("mongodb");

async function updateActiveUser(userId, bool) {
  const filter = { _id: ObjectID(userId) };
  const update = { $set: { active: bool } };
  const updatedUser = await updateDocument(User, filter, update);
  return updatedUser;
}

module.exports = updateActiveUser;
