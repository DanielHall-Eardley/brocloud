const { updateDocument, dbConnection } = require("../util/setupUtil");
const { ObjectID } = require("mongodb");
const Club = dbConnection().collection("club");
const formatHistory = require("../util/formatHistory");
const updateActiveUser = require("../util/updateActiveUser");

exports.startSync = async ({ videoId, timestamp }, clubSocket, { clubId }) => {
  const filter = { _id: new ObjectID(clubId) };
  const club = await Club.findOne(filter);
  const playingVideo = club.upNext.shift();

  if (!playingVideo) return;

  if (
    playingVideo.videoId.toString() === videoId.toString() &&
    !playingVideo.playedAtTime
  ) {
    const query = {
      ...filter,
      "upNext.videoId": videoId,
    };
    const update = {
      $set: {
        "upNext.$.playedAtTime": timestamp,
      },
    };

    await updateDocument(Club, query, update);
    return clubSocket.emit("syncTrack", timestamp);
  }

  return clubSocket.emit("syncTrack", playingVideo.playedAtTime);
};

function findVideo(current, videoId) {
  const video = current[0];

  if (video.videoId.toString() === videoId.toString()) {
    return video;
  }
  return false;
}

function addVideoToHistory(history, video) {
  const filteredHistory = history.filter(
    (v) => v.videoId.toString() !== video.videoId.toString()
  );
  return [video, ...filteredHistory];
}

function removeVideoFromUpNext(current, videoId) {
  return current.filter(
    (video) => video.videoId.toString() !== videoId.toString()
  );
}

async function updatePlaylist(upNext, history, query, db = Club) {
  const update = {
    $set: {
      history,
      upNext,
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
  const query = { _id: new ObjectID(clubId) };
  const club = await Club.findOne(query);
  const video = findVideo(club.upNext, videoId);

  if (video) {
    const updatedHistory = addVideoToHistory(club.history, video);
    const updatedCurrent = removeVideoFromUpNext(club.upNext, videoId);
    const result = await updatePlaylist(updatedCurrent, updatedHistory, query);
    const formattedHistory = formatHistory(result.history);

    clubSocket.emit("queueNext", {
      upNext: result.upNext,
      history: formattedHistory,
    });
  }
};

exports.pageClose = async (data, clubSocket, { userId, clubId }) => {
  await updateActiveUser(userId, false);
  clubSocket.emit("memberLeft", userId);
};
