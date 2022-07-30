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

exports.updateSync = (currentPosition, clubSocket, { clubId }) => {
  const newTime = Session.updateSeconds(currentPosition, clubId);
  if (newTime) {
    clubSocket.emit("syncTrack", currentPosition);
  }
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
  const video = {
    ...current[playedVideoIndex],
    playedAtTime: new Date(),
  };

  return {
    checkIfDone() {
      return historyVideoIndex > -1 && historyVideoIndex < 1;
    },

    checkVideoInHistory() {
      return historyVideoIndex > -1;
    },

    checkCurrentVideoExists() {
      return playedVideoIndex > -1;
    },

    addNewVideoToHistory() {
      console.log("new");
      updatedPlaylist = removeByIndex(current, playedVideoIndex);
      updatedHistory = [video, ...history];
    },

    updateVideoInHistory() {
      console.log("exists");
      const filteredHistory = history.filter(
        (v) => v.videoId.toString() !== videoId.toString()
      );
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

async function updatePlaylist(data, query, db = Club) {
  const update = {
    $set: {
      upNext: data.upNext,
      history: data.history,
    },
  };

  const updatedClub = await updateDocument(db, query, update);
  return {
    upNext: updatedClub.upNext,
    history: updatedClub.history,
  };
}

/* Move the played video in to the history if it does not already exist
in the history. If the played video does exist move it to the front
of the history queue and update the played at date */
exports.queueNext = async ({ videoId }, clubSocket, { clubId }) => {
  Session.resetSeconds(clubId);
  if (!videoId || videoId === "false") return;

  const query = {
    _id: new ObjectID(clubId),
  };

  const result = await findDocuments(Club, query);
  const { upNext, history } = result[0];
  const playlist = playlistState(upNext, history, videoId);

  if (!playlist.checkCurrentVideoExists() && playlist.checkIfDone()) {
    return clubSocket.emit("queueNext", playlist.data());
  }

  if (playlist.checkCurrentVideoExists() && !playlist.checkVideoInHistory()) {
    playlist.addNewVideoToHistory();
    const data = await updatePlaylist(playlist.data(), query);
    return clubSocket.emit("queueNext", data);
  }

  if (playlist.checkCurrentVideoExists() && playlist.checkVideoInHistory()) {
    playlist.updateVideoInHistory();
    const data = await updatePlaylist(playlist.data(), query);
    return clubSocket.emit("queueNext", data);
  }

  clubSocket.emit("queueNext", { upNext, history });
};

exports.pageClose = (data, clubSocket, { userId, clubId }) => {
  const updatedMembers = Session.removeMember(userId, clubId);
  console.log(data, userId);
  clubSocket.emit("memberLeft", updatedMembers);
};

/* 
I want all the videos to sync with whichever video is the furthest ahead

All users broad cast their play time to the server
The server has a master play time property for each club
Each time a user sends their current play time:
  The longest becomes the new play time (user playtime > master playtime)
  if (user playtime < master playtime but < 2 secs) do nothing
  if (user playtime < master playtime but > 2 secs) sync that user to the master playtime
*/
