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

function removeByIndex (array, index) {
  const startPortion = array.slice(0, index);
  const endPortion = array.slice(index + 1);
  return [...startPortion, ...endPortion];
}

function playlistState (current, history, videoId) {
  let updatedPlaylist = current
  let updatedHistory = history;
  
  function checkVideoID(video) {
    return video.videoId.toString() === videoId.toString();
  }

  const playedVideoIndex = current.findIndex(checkVideoID);
  const historyVideoIndex = history.findIndex(checkVideoID);

  function checkIfDone() {
    return historyVideoIndex > -1 && historyVideoIndex < 1;
  }

  function checkVideoInHistory () {
    return historyVideoIndex > 1;
  }

  function checkCurrentVideoExists () {
    return playedVideoIndex > -1;
  }

  function addNewVideoToHistory () {
    const video = current[playedVideoIndex];
    updatedPlaylist = removeByIndex(current, playedVideoIndex);
    updatedHistory = [video, ...history];
  }

  function data() {
    return {
      upNext: updatedPlaylist,
      history: updatedHistory
    }
  }
}

exports.queueNext = async ({ videoId }, clubSocket, { clubId, userId }) => {
  Session.resetSeconds(clubId);

  const query = {
    _id: new ObjectID(clubId),
  };

  const club = await findDocuments(Club, query);
  const playlist = playlistState(club.upNext, club.history, videoId);
  if (playlist.checkIfDone()) {
    return clubSocket.emit('queueNext', playlist.data())
  }

  if (playlist.checkCurrentVideoExists() && !playlist.checkVideoInHistory()) {
    playlist.addNewVideoToHistory()
    const { upNext, history } = playlist.data()
    const update = {
      $set: {
        upNext,
        history
      }
    }
    const updatedClub = await updateDocument(Club, query, update)
    return clubSocket.emit('queueNext', {
      upNext: updatedClub.upNext,
      history: updatedClub.history
    })
  }

  const startPortion = club.history.slice(0, historyVideoIndex);
  const endPortion = club.history.slice(historyVideoIndex + 1);
  const updatedVideo = {
    playedAtTime: new Date(),
    ...club.history[historyVideoIndex],
  };
  updatedHistory = [updatedVideo, ...startPortion, ...endPortion];
  const update = {
    $set: {
      upNext: 
    }
  }
  const updatedCLub = await updateDocument(Club, query, update)

  clubSocket.emit("queueNext", dataObj);
};

exports.pageClose = (data, clubSocket, { userId, clubId }) => {
  const updatedMembers = Session.removeMember(userId, clubId);
  console.log(data, userId);
  clubSocket.emit("memberLeft", updatedMembers);
};
