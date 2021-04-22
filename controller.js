const mongoUtil = require('./mongoUtil');
const catchError = require('./util/catchError');
const throwError = require('./util/throwError');
const { format, differenceInDays } = require('date-fns');
const fetch = require('node-fetch');

let youtubeApiKey = process.env.YOUTUBE_API_KEY  
if (!youtubeApiKey) {
  youtubeApiKey = require('./keys').youtubeApiKey
}

const formatTimestamp = (timestamp) => {
  const now = new Date();
  const timeOfPost = new Date(timestamp);
  const checkDay = differenceInDays(timeOfPost, now);

  if (checkDay === 0) {
    return `Today at ${format(timeOfPost, 'h:m aaa')}`;
  }

  if (checkDay === 1) {
    return `Yesterday at ${format(timeOfPost, 'h:m aaa')}`;
  }

  if (checkDay > 1 && checkDay < 7) {
    return format(timeOfPost, 'EEEE h:m aaa');
  }

  return format(timeOfPost, 'MMM do h:m aaa');
}

const db = mongoUtil.getDb();
// addCollections(db);
const { ObjectID } = require('mongodb');

const User = db.collection('user');
const Club = db.collection('club');
const Video = db.collection('video');
const Playlist = db.collection('playlist');

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

const extractIds = req => {
  const [userId, clubId] = req.get('Authorization').split(' ')
  return {
    userId,
    clubId
  }
}

const playlistRequest = (db, clubId) => {
  return db.aggregate([
    { $match: { clubId: new ObjectID(clubId) } },
    { 
      $lookup: {
        from: 'video',
        localField: 'upNext',
        foreignField: '_id',
        as: 'videoList'
      }
    }
  ]).toArray();
}

exports.dbUtil = {
  playlistRequest
}

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
  if (clubId && clubId !== 'null') {
    club._id = clubId;
  } else {
    if (!clubName) {
      return throwError('New club must have a name', 403);
    }

    const checkClubExists = await Club.findOne({ name: clubName })
    if (checkClubExists) {
      return throwError(`Club already exists with the name ${clubName}`, 403);
    }

    club = await addDocument(Club, { name: clubName, listeningHistory: []});
    await addDocument(
      Playlist, 
      {
        clubId: new ObjectID(club._id),
        currentlyPlaying: {},
        upNext: []
      }
    );
  }

  const userDoc = {
    firstName,
    lastName,
    nickName,
    clubId: new ObjectID(club._id)
  };

  const savedUser = await addDocument(User, userDoc);
  res.status(200).json({ user: savedUser });
})

exports.getMusic = catchError(async (req, res, next) => {
  const { clubId } = req.params;

  const userPromise = findDocuments(User, { clubId: new ObjectID(clubId) });
  const clubPromise = Club.findOne({ _id: new ObjectID(clubId) });
  const playlistPromise = playlistRequest(Playlist, clubId)

  const [
    members, 
    club, 
    playlist
  ] = await Promise.all([
    userPromise,
    clubPromise,
    playlistPromise
  ]);
  
  const history = club.listeningHistory.map(video => {
    const timestamp = formatTimestamp(video.mostRecentlyPlayed)

    return {
      videoId: video.videoId,
      name: video.name,
      userFullName: video.userFullName,
      timestamp
    }
  });

  const data = {
    members,
    club,
    playlist: playlist[0].videoList,
    history,
    currentlyPlaying: playlist[0].currentlyPlaying
  };

  res.render('./main/index.ejs', data);
});

exports.search = catchError(async (req, res, next) => {
  const url = `https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&maxResults=3&q=${req.body.searchQuery}&key=${youtubeApiKey}&fields=items(id,snippet/title,snippet/thumbnails/default)&videoCategoryId=10`
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

  const userPromise = User.findOne({ _id: new ObjectID(auth.userId) });
  const existingVideoPromise = Video.findOne({ videoId });
  const playlistPromise = Playlist.findOne({ clubId: new ObjectID(auth.clubId) })
  
  const [
    user, 
    existingVideo,
    playlist
  ] = await Promise.all([
    userPromise, 
    existingVideoPromise,
    playlistPromise
  ]);

  if (!user) {
    throwError('You must be signed up to add songs');
  }

  //create video if none exists
  let video;
  if(existingVideo) {
    video = existingVideo
  } else {
    const userFullName = `${user.firstName} \"${user.nickName}\" ${user.lastName}`;
    const videoDoc = {
      name,
      videoId,
      userFullName,
      firstPlayed: new Date(),
      mostRecentlyPlayed: new Date(),
    };

    video = await addDocument(Video, videoDoc);
  }
  /* 
  Update the playlist by either pushing to
  currently playing or pushing the end of the upNext queue 
  */
  const filter = { _id: new ObjectID(playlist._id) };
  const update = {};
  if (playlist.currentlyPlaying.name) {
    update.$push = { upNext: new ObjectID(video._id) }
  } else {
    update.$set = {
      currentlyPlaying: video
    }; 
  }

  const updatedPlaylist = await Playlist.updateOne(filter, update);

  if (updatedPlaylist.result.ok !== 1) {
    throwError('Unable to add your song to the playlist')
  }

  // Aggregate the playlist to lookup videos from videoIds
  const newPlaylist = await playlistRequest(Playlist, auth.clubId)

  // Check if the new video has been added to queue
  const last = newPlaylist[0].videoList.length - 1
  res.status(200).json({ 
    newVideo: newPlaylist[0].videoList[last],
    currentlyPlaying: newPlaylist[0].currentlyPlaying
  });
});

