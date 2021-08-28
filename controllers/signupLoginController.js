const catchError = require('../util/catchError');
const throwError = require('../util/throwError');

const { 
  addDocument,
  findDocuments,
  dbConnection,
} = require('../util/setupUtil');

const { ObjectID } = require('mongodb');

const User = dbConnection().collection('user');
const Club = dbConnection().collection('club');

let youtubeApiKey = process.env.YOUTUBE_API_KEY  
if (!youtubeApiKey) {
  youtubeApiKey = require('../config/keys').youtubeApiKey
}

exports.getSignup = catchError(async (req, res, next) => {
  const clubs = await findDocuments(Club);
  const data = {
    clubs,
  };

  res.render('./signup/index.ejs', data);
});

exports.joinClub = catchError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    nickName,
    clubId
  } = req.body;

  const existingClub = await Club.findOne({ _id: new ObjectID(clubId) })
  
  if (!existingClub) {
    return throwError('Club not found', 404);
  }

  const userDoc = {
    firstName,
    lastName,
    nickName,
    clubId: new ObjectID(existingClub._id)
  };
  const savedUser = await addDocument(User, userDoc);

  res.status(200).json({ user: savedUser });
})

exports.createClub = catchError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    nickName,
    clubName
  } = req.body;

  if (!clubName) {
    return throwError('New club must have a name', 403);
  }

  const clubDoc = {
    name: clubName,
    history: [],
    upNext: []
  }
  const club = await addDocument(Club, clubDoc);

  const userDoc = {
    firstName,
    lastName,
    nickName,
    clubId: new ObjectID(club._id)
  };
  const savedUser = await addDocument(User, userDoc);

  res.status(200).json({ user: savedUser });
});