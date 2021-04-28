const { updateDocument,dbConnection} = require('./setupUtil');
const { ObjectID } = require('mongodb');
const Session = require('./sessionState');
const formatTimestamp = require('./util/formatTimeStamp');

const Club = dbConnection().collection('club');

exports.setupClub = (clubSocket, {userId, clubId}) => {
  const club = Session.getClub(clubId);
  const userActive = Session.checkUserActive(userId, clubId);

  if (userActive) {
    return clubSocket.emit('updateClubState', club)
  };

  Session.addMember(userId, clubId);
  clubSocket.emit('updateClubState', Session.getClub(clubId))
};

exports.updateSync = (data, clubSocket, { userId, clubId }) => {
  const { currentPosition } = data
  Session.updateSeconds(currentPosition, userId, clubId);
  clubSocket.emit('syncTrack', currentPosition);
};

exports.queueNext = async (clubSocket, { clubId }) => {
  Session.resetSeconds(clubId)
  const filter = {
    _id: new ObjectID(clubId)
  }

  const club = await Club.findOne(filter);

  //if the queue is empty do nothing
  if (club.upNext.length < 1) {
    return
  }
  const playedVideo = club.upNext.shift()

  //pull the played video from the queue
  const update = {
    $pull: {
      upNext: { _id: playedVideo._id }
    }
  }

  //if the video is valid add to history
  if (playedVideo) {
    update.$push = {
      history: playedVideo
    }
  }
  
  const updatedClub = await updateDocument(Club, filter, update);
  const newVideo = updatedClub.upNext.shift();
  const rawDate = playedVideo.playedAtTime;
  playedVideo.playedAtTime = formatTimestamp(rawDate);
  
  /*
  Send the next video to be played (newVideo)
  and the id of previous video for removal from the DOM  
  */
  const dataObj = {
    newVideo,
    previousVideo: playedVideo
  }

  clubSocket.emit('queueNext', dataObj);
}

exports.pageClose = (data, clubSocket, { userId, clubId }) => {
  const updatedMembers = Session.removeMember(userId, clubId);
  console.log(data, userId)
  clubSocket.emit('memberLeft', updatedMembers)
}