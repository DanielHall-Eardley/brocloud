const { updateDocument, dbConnection } = require("../util/setupUtil");
const { ObjectID } = require("mongodb");
const Session = require("../util/sessionState")();
const Club = dbConnection().collection("club");
const formatHistory = require("../util/formatHistory");

exports.setupClub = (clubSocket, { userId, clubId }) => {
  const club = Session.getClub(clubId);
  const userActive = Session.checkUserActive(userId, clubId);

  if (userActive) {
    return clubSocket.emit("updateClubState", club);
  }

  Session.addMember(userId, clubId);
  clubSocket.emit("updateClubState", Session.getClub(clubId));
};

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

exports.pageClose = (data, clubSocket, { userId, clubId }) => {
  const updatedMembers = Session.removeMember(userId, clubId);
  console.log(data, userId);
  clubSocket.emit("memberLeft", updatedMembers);
};
