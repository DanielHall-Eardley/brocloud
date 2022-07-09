const {
  updateDocument,
  dbConnection,
  findDocuments,
} = require("../util/setupUtil");
const { ObjectID } = require("mongodb");
const Session = require("../util/sessionState")();
const formatTimestamp = require("../util/formatTimeStamp");

const Club = dbConnection().collection("club");

exports.setupClub = (clubSocket, { userId, clubId }) => {
  const club = Session.getClub(clubId);
  const userActive = Session.checkUserActive(userId, clubId);

  if (userActive) {
    return clubSocket.emit("updateClubState", club);
  }

  Session.addMember(userId, clubId);
  clubSocket.emit("updateClubState", Session.getClub(clubId));
};

exports.updateSync = (data, clubSocket, { userId, clubId }) => {
  const { currentPosition } = data;
  Session.updateSeconds(currentPosition, userId, clubId);
  clubSocket.emit("syncTrack", currentPosition);
};

exports.queueNext = async ({ videoId }, clubSocket, { clubId, userId }) => {
  Session.resetSeconds(clubId);

  const query = {
    _id: new ObjectID(clubId),
  };

  function checkVideoID(video) {
    return video.videoId.toString() === videoId.toString();
  }

  const club = await findDocuments(Club, query);
  const playedVideoIndex = club.upNext.findIndex(checkVideoID);
  const historyVideoIndex = club.history.findIndex(checkVideoID);

  let updatedPlaylist = club.upNext;
  let updatedHistory = club.history;

  if (!historyVideoIndex === -1) {
    updatedHistory = [club.upNext[playedVideoIndex], ...club.history];
  }

  if (playedVideoIndex === 0) {
    const startPortion = club.upNext.slice(0, playedVideoIndex);
    const endPortion = club.upNext.slice(playedVideoIndex + 1);
    updatedPlaylist = [...startPortion, ...endPortion];
  }

  const startPortion = club.history.slice(0, historyVideoIndex);
  const endPortion = club.history.slice(historyVideoIndex + 1);
  const updatedVideo = {
    playedAtTime: new Date(),
    ...club.history[historyVideoIndex],
  };
  updatedHistory = [updatedVideo, ...startPortion, ...endPortion];
  //save to db

  clubSocket.emit("queueNext", dataObj);
};

exports.pageClose = (data, clubSocket, { userId, clubId }) => {
  const updatedMembers = Session.removeMember(userId, clubId);
  console.log(data, userId);
  clubSocket.emit("memberLeft", updatedMembers);
};
