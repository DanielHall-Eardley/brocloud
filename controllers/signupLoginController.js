const catchError = require("../util/catchError");
const throwError = require("../util/throwError");
const setToken = require("../util/setToken");
const bcrypt = require("bcrypt");
const { createJWT } = require("../util/createJWT");
const host = process.env.HOST;

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
  console.log(clubs);
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
  const club = await Club.findOne({ name: clubName });

  if (!club) {
    return throwError("Your club could not be found", 404);
  }

  // Use the club id to uniquely identify the correct user
  const query = {
    firstName,
    clubId: club._id,
  };

  const user = await User.findOne(query, { password: 0 });

  if (!user) {
    return throwError("Your profile could not be found", 404);
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return throwError("Incorrect password", 422);
  }

  const token = await createJWT(user._id);
  setToken(token, res);
  const sanitizedUser = sanitizeUser(user);
  res.status(200).json({ user: sanitizedUser });
});

function sanitizeUser(user) {
  const sanitizedUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    nickName: user.nickName,
    clubId: user.clubId,
    _id: user._id,
  };

  return sanitizedUser;
}

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
  return sanitizeUser(savedUser);
}

exports.joinClub = catchError(async (req, res, next) => {
  const clubId = req.params.clubId;
  const existingClub = await Club.findOne({ _id: new ObjectID(clubId) });
  if (!existingClub) {
    return throwError("Club not found", 404);
  }

  const user = await createUser(req.body, existingClub._id);
  const token = await createJWT(user._id);
  setToken(token, res);
  res.status(200).json({ user });
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
  const clubName = req.params.clubName;
  const existingClub = await Club.findOne({ name: clubName });
  if (existingClub) {
    return throwError("A Club already exists with this name", 403);
  }

  const club = await createClub(clubName);
  const user = await createUser(req.body, club._id);

  const token = await createJWT(user._id);
  setToken(token, res);
  res.status(200).json({ user });
});
