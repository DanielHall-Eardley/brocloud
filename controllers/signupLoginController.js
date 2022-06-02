const catchError = require("../util/catchError");
const throwError = require("../util/throwError");
const bcrypt = require("bcrypt");
const { createJWT } = require("../util/createJWT");
const host = process.env.HOST;
const youtubeApiKey = process.env.YOUTUBE_API_KEY;

const {
  addDocument,
  findDocuments,
  dbConnection,
} = require("../util/setupUtil");

const { ObjectID } = require("mongodb");

const User = dbConnection().collection("user");
const Club = dbConnection().collection("club");

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

async function createUser(body, clubId) {
  const { firstName, lastName, nickName, password } = body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const userDoc = {
    firstName,
    lastName,
    nickName,
    clubId: new ObjectID(clubId),
    password: hashedPassword,
  };
  const savedUser = await addDocument(User, userDoc);

  const sanitizedUser = {
    firstName: savedUser.firstName,
    lastName: savedUser.lastName,
    nickName: savedUser.nickName,
    clubId: savedUser.clubId,
    _id: savedUser._id,
  };

  return sanitizedUser;
}

exports.joinClub = catchError(async (req, res, next) => {
  const clubId = req.params.clubId;
  const existingClub = await Club.findOne({ _id: new ObjectID(clubId) });
  if (!existingClub) {
    return throwError("Club not found", 404);
  }

  const user = await createUser(req.body, existingClub._id);

  const cb = (token) => {
    res.status(200).json({ user, token });
  };

  createJWT(user._id, cb);
});

async function createClub(clubName) {
  if (!clubName) {
    return throwError("New club must have a name", 403);
  }

  const clubDoc = {
    name: clubName,
    history: [],
    upNext: [],
  };
  const club = await addDocument(Club, clubDoc);
  return club;
}

exports.createClub = catchError(async (req, res, next) => {
  const club = await createClub(req.params.clubName);
  const user = await createUser(req.body, club._id);

  const cb = (token) => {
    res.status(200).json({ user, token });
  };

  createJWT(user._id, cb);
});
