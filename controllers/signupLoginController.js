const catchError = require("../util/catchError");
const throwError = require("../util/throwError");
const bcrypt = require("bcrypt");
let { youtubeApiKey, host } = require("../config/keys");
const { createJWT } = require("../util/createJWT");

const {
  addDocument,
  findDocuments,
  dbConnection,
} = require("../util/setupUtil");

const { ObjectID } = require("mongodb");

const User = dbConnection().collection("user");
const Club = dbConnection().collection("club");

let checkEnvVar = process.env.YOUTUBE_API_KEY;
if (checkEnvVar) {
  youtubeApiKey = checkEnvVar;
}

exports.getSignup = catchError(async (req, res, next) => {
  const clubs = await findDocuments(Club);
  const data = {
    clubs,
    host,
  };

  res.render("./signup/index.ejs", data);
});

exports.getLogin = catchError(async (req, res, next) => {
  const data = {
    host,
  };

  res.render("./login/index.ejs", data);
});

exports.login = catchError(async (req, res, next) => {
  const { firstName, password, clubName } = req.body;

  // Find the club first because it is unique
  const club = await findDocuments(
    Club,
    { name: clubName },
    {},
    "Your club could not be found"
  );

  // Use the club id to uniquely identify the correct user
  const query = {
    firstName,
    clubId: club._id,
  };
  const user = await findDocuments(
    User,
    query,
    {},
    "Your profile could not be found"
  );
  console.log(user);
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return throwError("Incorrect password", 422);
  }

  const cb = () => {
    // Make played video timestamp human readable
    const formattedHistory = club.history.map((video) => {
      const timestamp = formatTimestamp(video.playedAtTime);
      return {
        ...video,
        playedAtTime: timestamp,
      };
    });

    const data = {
      members,
      club,
      history: formattedHistory,
      upNext: club.upNext,
      token,
    };

    initClubSocket(club._id, user._id);
    res.render("./main/index.ejs", data);
  };

  createJWT(user._id, cb);
});

exports.joinClub = catchError(async (req, res, next) => {
  const { firstName, lastName, nickName, clubId, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingClub = await Club.findOne({ _id: new ObjectID(clubId) });

  if (!existingClub) {
    return throwError("Club not found", 404);
  }

  const userDoc = {
    firstName,
    lastName,
    nickName,
    clubId: new ObjectID(existingClub._id),
    password: hashedPassword,
  };
  const savedUser = await addDocument(User, userDoc);

  const cb = () => {
    res.status(200).json({ user: savedUser });
  };

  createJWT(savedUser._id, cb);
});

exports.createClub = catchError(async (req, res, next) => {
  const { firstName, lastName, nickName, clubName, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!clubName) {
    return throwError("New club must have a name", 403);
  }

  const clubDoc = {
    name: clubName,
    history: [],
    upNext: [],
  };
  const club = await addDocument(Club, clubDoc);

  const userDoc = {
    firstName,
    lastName,
    nickName,
    clubId: new ObjectID(club._id),
    password: hashedPassword,
  };
  const savedUser = await addDocument(User, userDoc);

  const cb = () => {
    res.status(200).json({ user: savedUser });
  };

  createJWT(savedUser._id, cb);
});
