const { mainIo } = require("./setupUtil");
const socketController = require("../controllers/socketController");

let clubSocket = null;
function initClubSocket(clubId) {
  if (clubSocket) return clubSocket;
  clubSocket = mainIo().of(`/${clubId}`);

  clubSocket.on("connection", (socket) => {
    const forwardClubSocket = (fn) => (data) => {
      if (data) {
        fn(data, clubSocket, socket.handshake.query);
      } else {
        fn(clubSocket, socket.handshake.query);
      }
    };

    socket.on("startSync", forwardClubSocket(socketController.startSync));
    socket.on("queueNext", forwardClubSocket(socketController.queueNext));
    socket.on("disconnect", forwardClubSocket(socketController.pageClose));
  });

  return clubSocket;
}

module.exports = initClubSocket;
