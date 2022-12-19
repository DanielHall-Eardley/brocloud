const User = dbConnection().collection("user");

async function getClubMembers(clubId) {
  const allClubUsers = await findDocuments(User, {
    clubId: new ObjectID(clubId),
  });
  return allClubUsers;
}

module.exports = getClubMembers;
