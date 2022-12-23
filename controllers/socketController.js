const { updateDocument, dbConnection } = require("../util/setupUtil");
const { ObjectID } = require("mongodb");
const Club = dbConnection().collection("club");
const formatHistory = require("../util/formatHistory");
const updateActiveUser = require("../util/updateActiveUser");
const findVideo = require("../util/findVideo");

function addVideoToHistory(history, video) {
  const filteredHistory = history.filter(
    (v) => v.videoId.toString() !== video.videoId.toString()
  );
  return [video, ...filteredHistory];
}

function removeVideoFromUpNext(current, videoId, timestamp) {
  // remove previous video
  const updatedCurrent = current.filter(
    (video) => video.videoId.toString() !== videoId.toString()
  );
  // add sync timestamp to next video
  if (updatedCurrent[0] && !updatedCurrent[0].playedAtTime) {
    updatedCurrent[0].playedAtTime = timestamp;
  }

  return updatedCurrent;
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
exports.queueNext = async ({ videoId, timestamp }, clubSocket, { clubId }) => {
  const query = { _id: new ObjectID(clubId) };
  const club = await Club.findOne(query);
  const video = findVideo(club.upNext, videoId);

  if (video) {
    const updatedHistory = addVideoToHistory(club.history, video);
    const updatedCurrent = removeVideoFromUpNext(
      club.upNext,
      videoId,
      timestamp
    );
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
