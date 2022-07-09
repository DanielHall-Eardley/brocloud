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

function removeByIndex(array, index) {
  const startPortion = array.slice(0, index);
  const endPortion = array.slice(index + 1);
  return [...startPortion, ...endPortion];
}

function playlistState(current, history, videoId) {
  let updatedPlaylist = current;
  let updatedHistory = history;

  function checkVideoID(video) {
    return video.videoId.toString() === videoId.toString();
  }

  const playedVideoIndex = current.findIndex(checkVideoID);
  const historyVideoIndex = history.findIndex(checkVideoID);
  const video = current[playedVideoIndex];

  return {
    checkIfDone() {
      return historyVideoIndex > -1 && historyVideoIndex < 1;
    },

    checkVideoInHistory() {
      return historyVideoIndex > 1;
    },

    checkCurrentVideoExists() {
      return playedVideoIndex > -1;
    },

    addNewVideoToHistory() {
      updatedPlaylist = removeByIndex(current, playedVideoIndex);
      updatedHistory = [video, ...history];
    },

    updateVideoInHistory() {
      const filteredHistory = removeByIndex(history, historyVideoIndex);
      updatedPlaylist = removeByIndex(current, playedVideoIndex);
      updatedHistory = [video, ...filteredHistory];
    },

    data() {
      return {
        upNext: updatedPlaylist,
        history: updatedHistory,
      };
    },
  };
}

async function updatePlaylist(data, db = Club) {
  const update = {
    $set: {
      upNext: data.upNext,
      history: data.history,
    },
  };

  const updatedClub = await updateDocument(Club, query, update);
  return {
    upNext: updatedClub.upNext,
    history: updatedClub.history,
  };
}

exports.queueNext = async ({ videoId }, clubSocket, { clubId }) => {
  Session.resetSeconds(clubId);

  const query = {
    _id: new ObjectID(clubId),
  };

  const { upNext, history } = await findDocuments(Club, query);
  const playlist = playlistState(upNext, history, videoId);

  if (playlist.checkIfDone()) {
    return clubSocket.emit("queueNext", playlist.data());
  }

  if (playlist.checkCurrentVideoExists() && !playlist.checkVideoInHistory()) {
    playlist.addNewVideoToHistory();
    const data = await updatePlaylist(playlist.data());
    return clubSocket.emit("queueNext", data);
  }

  if (playlist.checkCurrentVideoExists() && playlist.checkVideoInHistory()) {
    playlist.updateVideoInHistory();
    const data = await updatePlaylist(playlist.data());
    return clubSocket.emit("queueNext", data);
  }

  clubSocket.emit("queueNext", { upNext, history });
};

exports.pageClose = (data, clubSocket, { userId, clubId }) => {
  const updatedMembers = Session.removeMember(userId, clubId);
  console.log(data, userId);
  clubSocket.emit("memberLeft", updatedMembers);
};
