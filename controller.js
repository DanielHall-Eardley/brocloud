const catchError = require('./util/catchError');
const throwError = require('./util/throwError');
const fetch = require('node-fetch');
const sanitizeHtml = require('sanitize-html');
const { initClubSocket, clubNs } = require('./socketUtil');
const formatTimestamp = require('./util/formatTimeStamp');

const { 
  updateDocument,
  addDocument,
  findDocuments,
  dbConnection,
} = require('./setupUtil');
const { ObjectID } = require('mongodb');

const User = dbConnection().collection('user');
const Club = dbConnection().collection('club');

let youtubeApiKey = process.env.YOUTUBE_API_KEY  
if (!youtubeApiKey) {
  youtubeApiKey = require('./keys').youtubeApiKey
}

const extractIds = req => {
  const [userId, clubId] = req.get('Authorization').split(' ')
  return {
    userId,
    clubId
  }
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

exports.getMusic = catchError(async (req, res, next) => {
  const { clubId, userId } = req.params;

  const userPromise = findDocuments(User, { clubId: new ObjectID(clubId) });
  const clubPromise = Club.findOne({ _id: new ObjectID(clubId) });

  const [
    members, 
    club, 
  ] = await Promise.all([
    userPromise,
    clubPromise,
  ]);

  if (!club) {
    throwError('No club found', 404);
  }
  
  const formattedHistory = club.history.map(video => {
      const timestamp = formatTimestamp(video.playedAtTime)
      return {
        ...video,
        playedAtTime: timestamp
      }
  });
  
  const data = {
    members,
    club,
    history: formattedHistory,
    upNext: club.upNext
  };

  initClubSocket(club._id);
  res.render('./main/index.ejs', data);
});

exports.search = catchError(async (req, res, next) => {
  const url = `https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&maxResults=8&q=${req.body.searchQuery}&key=${youtubeApiKey}&fields=items(id,snippet/title,snippet/thumbnails/default)&videoCategoryId=10`
  const response = await fetch(url);
  const results = await response.json();
  res.status(200).json({ results });
});

exports.addVideo = catchError(async (req, res, next) => {
  const auth = extractIds(req);

  const { 
    name,
    videoId
  } = req.body;

  if (!name || !videoId) {
    throwError('There was a problem adding your video', 422)
  }

  const user = await User.findOne({ _id: new ObjectID(auth.userId) });
  const userFullName = `${user.firstName} \"${user.nickName}\" ${user.lastName}`;
  const sanitizeName = sanitizeHtml(name);

  const videoDoc = {
    _id: new ObjectID(),
    name: sanitizeName,
    videoId,
    userFullName,
    playedAtTime: new Date()
  };

  const filter = {
    _id: new ObjectID(auth.clubId)
  }

  const update = {
    $push: { upNext: videoDoc }
  }

  const updatedClub = await updateDocument(Club, filter, update) 
  const lastVideo = updatedClub.upNext.pop()

  const clubSocket = clubNs();
  clubSocket.emit('addToPlaylist', { video: lastVideo })
  res.status(200).json({ message: "Video added" });
});

