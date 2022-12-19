const catchError = require("../util/catchError");
const throwError = require("../util/throwError");
const sanitizeHtml = require("sanitize-html");
const initClubSocket = require("../util/socketUtil");
const formatHistory = require("../util/formatHistory");
const updateActiveUser = require("../util/updateActiveUser");
const sanitizeUser = require("../util/sanitizeUser");

const {
  updateDocument,
  findDocuments,
  dbConnection,
} = require("../util/setupUtil");

const { ObjectID } = require("mongodb");

const User = dbConnection().collection("user");
const Club = dbConnection().collection("club");

const extractIds = (req) => {
  const [userId, clubId] = req.get("Authorization").split(" ");
  return {
    userId,
    clubId,
  };
};

exports.getClub = catchError(async (req, res, next) => {
  const { clubId, userId } = req.params;

  const user = await updateActiveUser(userId, true);

  if (!user) {
    return res.redirect("/signup");
  }

  const membersPromise = findDocuments(User, { clubId: new ObjectID(clubId) });
  const clubPromise = Club.findOne({ _id: new ObjectID(clubId) });
  const [members, club] = await Promise.all([membersPromise, clubPromise]);

  if (!club) {
    throwError("No club found", 404);
  }

  const formattedHistory = formatHistory(club.history);

  const data = {
    members,
    club,
    history: formattedHistory,
    upNext: club.upNext,
  };

  const sanitizedUser = sanitizeUser(user);
  const clubSocket = initClubSocket(club._id);
  clubSocket.emit("updateActiveMember", sanitizedUser);
  res.render("./main/index.ejs", data);
});

exports.addVideo = catchError(async (req, res, next) => {
  const auth = extractIds(req);

  const { name, videoId } = req.body;

  if (!name || !videoId) {
    throwError("There was a problem adding your video", 422);
  }

  const user = await User.findOne({ _id: new ObjectID(auth.userId) });
  const userFullName = `${user.firstName} \"${user.nickName}\" ${user.lastName}`;
  const sanitizeName = sanitizeHtml(name);

  const videoDoc = {
    _id: new ObjectID(),
    name: sanitizeName,
    videoId,
    userFullName,
  };

  const filter = {
    _id: new ObjectID(auth.clubId),
  };

  const update = {
    $push: { upNext: videoDoc },
  };

  const updatedClub = await updateDocument(Club, filter, update);
  const lastVideo = updatedClub.upNext.pop();

  const clubSocket = initClubSocket();
  clubSocket.emit("addToPlaylist", { video: lastVideo });
  res.status(200).json({ message: "Video added" });
});
