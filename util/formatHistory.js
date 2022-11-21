const formatTimestamp = require("./formatTimeStamp");

const formatHistory = (history, formatDate = formatTimestamp) => {
  const formattedHistory = history.map((video) => {
    const timestamp = formatDate(video.playedAtTime);
    return {
      ...video,
      playedAtTime: timestamp,
    };
  });

  return formattedHistory;
};

module.exports = formatHistory;
