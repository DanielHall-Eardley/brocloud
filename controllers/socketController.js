const { updateDocument, dbConnection } = require("../util/setupUtil");
const { ObjectID } = require("mongodb");
const Session = require("../util/sessionState")();
const { getTime } = require("date-fns");
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

exports.startSync = async (videoId, clubSocket, { clubId }) => {
  const filter = { _id: new ObjectID(clubId) };
  const club = await Club.findOne(filter);
  const playingVideo = club.upNext.shift();
  if (
    playingVideo.videoId.toString() === videoId.toString() &&
    !playingVideo.playedAtTime
  ) {
    const update = {
      $set: {
        "upNext.$[element].playedAtTime": getTime(new Date()),
      },
      arrayFilters: [{ "element.videoId": videoId }],
    };
    const updatedClub = await updateDocument(Club, filter, update);
    return clubSocket.emit("syncTrack", updatedClub.playedAtTime);
  }

  return clubSocket.emit("syncTrack", club.playedAtTime);
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
  const video = current[playedVideoIndex];
  video.playedAtTime = null;

  return {
    checkVideoInQueue() {
      return playedVideoIndex === 0;
    },

    addNewVideoToHistory() {
      updatedPlaylist = removeByIndex(current, playedVideoIndex);
      const filteredHistory = history.filter(
        (v) => v.videoId.toString() !== videoId.toString()
      );
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

/* Remove the played video from the queue, 
remove the played video from the history
if exists, add played video to start of history */
exports.queueNext = async ({ videoId }, clubSocket, { clubId }) => {
  const { upNext, history } = await Club.findOne({ _id: new ObjectID(clubId) });
  const playlist = playlistState(upNext, history, videoId);

  if (playlist.checkVideoInQueue()) {
    playlist.addNewVideoToHistory();
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
