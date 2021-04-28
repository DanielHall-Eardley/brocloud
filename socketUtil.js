const { mainIo } = require('./setupUtil');
const socketController = require('./socketController')

let clubSocket;
const initClubSocket = clubId => {
  clubSocket = mainIo().of(`/${clubId}`);

  clubSocket.on("connection", socket => {
    const forwardClubSocket = fn => (data) => {
      if (data) {
        fn(data, clubSocket, socket.handshake.query)
      } else {
        fn(clubSocket, socket.handshake.query)
      } 
    }

    socket.on('setupClub', forwardClubSocket(socketController.setupClub))
    socket.on('updateSync', forwardClubSocket(socketController.updateSync));
    socket.on('queueNext', forwardClubSocket(socketController.queueNext));
    socket.on('disconnect', forwardClubSocket(socketController.pageClose));
  })
};

const clubNs = () => clubSocket;

module.exports = {
  initClubSocket,
  clubNs
}