import initYouTube from "./youTube";
import { redirectToLogin } from "../common/global";
import getUser from "./getUser";
const user = getUser();

let clubSocket;
function initSocket() {
  if (user) {
    clubSocket = io(`/${user.clubId}`, {
      query: {
        userId: user._id,
        clubId: user.clubId,
      },
    });

    clubSocket.on("connect", () => {
      console.log("Club socket connected");
      initYouTube();
    });
  } else {
    redirectToLogin();
  }
}

export { clubSocket };
export default initSocket;
