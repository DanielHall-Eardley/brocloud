const mongoUtil = require('./mongoUtil');
const catchError = require('./util/catchError');
const throwError = require('./util/throwError');
const addCollections = require('./collections/addCollections');

const db = mongoUtil.getDb();
// addCollections(db);
const { ObjectID } = require('mongodb');

const User = db.collection('user');
const Club = db.collection('club');

const findDocuments = (
  db, query = {}, options = {} 
) => {
  return new Promise(async (resolve, reject) => {
    const cursor = await db.find(query, options)
    const data = await cursor.toArray()
    if (!data) {
      reject(throwError('Documents not found', 404));
    }

    await cursor.close()
    resolve(data)
  })
}

const addDocument = async (db, newDoc) => {
  const response = await db.insertOne(newDoc);
  return response.ops[0];
};

exports.getSignup = catchError(async (req, res, next) => {
  const clubs = await findDocuments(Club);
  const data = {
    clubs,
    action: 'signup'
  };

  res.render('./signup/index.ejs', data);
});

exports.signup = catchError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    nickName,
    clubName,
    clubId
  } = req.body;

  let club = {};
  if (clubId !== 'null') {
    club._id = clubId
  } else {
    if (!clubName) {
      return throwError('New club must have a name', 403);
    }

    const checkClubExists = await Club.findOne({ name: clubName })
    if (checkClubExists) {
      return throwError(`Club already exists with the name ${clubName}`, 403)
    }

    club = await addDocument(Club, { name: clubName})
  }

  const userDoc = {
    firstName,
    lastName,
    nickName,
    clubId: new ObjectID(club._id),
    isActive: false
  }

  const savedUser = await addDocument(User, userDoc)
  res.status(200).json({ user: savedUser })
})

exports.getMusic = catchError(async (req, res, next) => {
  const data = {
    
  };

  res.render('./main/index.ejs', data);
});
