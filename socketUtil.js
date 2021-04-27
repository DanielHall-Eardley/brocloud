const { mainIo } = require('./setupUtil');
const socketController = require('./socketController')

let clubSocket;
const initClubSocket = clubId => {
  clubSocket = mainIo().of(`/${clubId}`);

  clubSocket.on("connection", socket => {
    const forwardClubSocket = fn => (data) => {
      fn(data, clubSocket)
    }

    socket.on('setupClub', forwardClubSocket(socketController.setupClub))
    socket.on('updateSync', forwardClubSocket(socketController.updateSync));
    socket.on('queueNext', forwardClubSocket(socketController.queueNext));
    socket.on('pageClose', forwardClubSocket(socketController.pageClose));
  })
};

const clubNs = () => clubSocket;

module.exports = {
  initClubSocket,
  clubNs
}