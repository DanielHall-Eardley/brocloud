import initYouTube from './youTube'
import getUser from './getUser';
const user = getUser();

let clubSocket;
function initSocket () {
  clubSocket = io(`/${user.clubId}`, {
    query: {
      userId: user._id,
      clubId: user.clubId
    }
  })
  clubSocket.on('connect', () => {
    console.log('Club socket connected');
    initYouTube()
  })
}

export { clubSocket }
export default initSocket;
