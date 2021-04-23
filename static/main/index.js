import { FormState, errorState, host } from '../common/global.js';
import api from '../common/api';
const formState = new FormState()

let player;
let mainSocket;
let clubSocket;
let intervalId;
const user = JSON.parse(localStorage.getItem('user'));

window.onload = () => {
  const form = document.querySelector('.main--search');
  formState.init(form);
  form.addEventListener('submit', formSubmit);
  addHistoryListeners()
  
  mainSocket = io(host)
  mainSocket.on('connect', () => {
    console.log('Socket connected')
    mainSocket.emit('setUpNs', user.clubId)
  })

  clubSocket = io(`/${user.clubId}`)
  clubSocket.on('connect', () => {
    console.log('Club NS socket connected')
    emitClubInfo()
    onClubInfo()
  })
};

function emitClubInfo () {
  clubSocket.emit('setUpClub', user._id)
}

function onClubInfo () {
  clubSocket.on('updateClubState', updateClubState)
  clubSocket.on('updatePlaylist', updatePlaylist);
  clubSocket.on('stopSync', cancelEmitSeconds)
}

function updateClubState (club) {
  const clubId = user.clubId; 
  const videoId = document.querySelector('#videoId')
  
  if (!videoId) {
    clubSocket.emit('playNext', clubId);
    return
  }
  console.log(club);
  onYouTubeIframeAPIReady(videoId.value, club.ellapsedSeconds, club.syncActive);
  updateMembers(club.members);
}

function emitSeconds (player, clubId) {
  intervalId = setInterval(() => {
    const data = {
      seconds: player.getCurrentTime(),
      syncActive: true,
      clubId
    }

    clubSocket.emit('updateSync', data);
  }, 1000)
}

function cancelEmitSeconds (intervalId) {
  clearInterval(intervalId)
}

function addHistoryListeners () {
  const ul = document.querySelector('.main--history-list');
  const children = ul.getElementsByTagName('li');

  for (let li of children) {
    const videoId = li.getAttribute('id')
    const button = li.getElementsByTagName('button')[0];
    const name = button.getElementsByTagName('p')[0].innerText
    addVideoListener(button, null,  name, videoId)
  }
}

function updateMembers (members) {
  const ul = document.querySelector('.main--squad-list');
  const children = ul.getElementsByTagName('li')

  members.forEach(memberId => {
    for (let member of children ) {
      if (member.id.toString() === memberId.toString()) {
        const memberChildren = member.getElementsByTagName('span')
        memberChildren[1].className = 'u--green-circle';
      }
    }
  });
}

function onYouTubeIframeAPIReady(videoId, ellapsedSeconds, syncActive) {
  player = new YT.Player('player', {
    height: '300',
    width: '500',
    videoId: videoId,
    playerVars: {
      cc_load_policy: 0,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      modestbranding: 1,
    },
    events: {
      onReady: event => {
        onPlayerReady(event, ellapsedSeconds, syncActive)
      },
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  });
}

function onPlayerReady (event, ellapsedSeconds, syncActive) {
  event.target.seekTo(ellapsedSeconds, true);

  /* 
    check if someone is already emitting the
    current song ellapsed seconds, if not this
    user becomes the primary emitter for all
    preceding users to sync to.
    */
    if (!syncActive) {
      emitSeconds(event.target, user.clubId)
    }  
}

async function formSubmit (event) {
  event.preventDefault();
  const query = formState.formData();
  const data = await api.search(query);
  const resultSection = document.querySelector('.main--search-results');
  resultSection.innerText = "";
  const resultsList = createResultList(data.results);
  resultSection.appendChild(resultsList);
}

function addVideoListener (btn, ul, name, videoId) {
  btn.addEventListener('click', async (event) => {
    /* if video is from search results, 
    clear search results */
    if (ul) {
      ul.innerText = "";
    }

    const body = {
      name,
      videoId
    }

    const data = await api.addVideo(body)
    addToPlaylist(data);
  })
}

function createResultList (data) {
  const list = new DocumentFragment();
  const ul = document.createElement('ul');
  ul.className = 'main--result-list';

  data.items.forEach(item => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.className = 'btn--result';
    addVideoListener(button, ul, item.snippet.title, item.id.videoId);

    const span = document.createElement('span');
    const title = document.createTextNode(item.snippet.title);
    span.appendChild(title)

    const img = document.createElement('img');
    img.setAttribute('src', item.snippet.thumbnails.default.url);
    img.className = 'thumbnail';

    button.appendChild(span);
    button.appendChild(img);
    li.appendChild(button)
    ul.appendChild(li);
  })

  list.append(ul)
  return list
}

function addToPlaylist (data) {
  const { 
    currentlyPlaying, 
    queuedVideo,
    syncActive,
    ellapsedSeconds
   } = data;
  
  if (!queuedVideo && currentlyPlaying.videoId) {
    let currentVideo = document.querySelector('.main--playing');
    const oldChild = currentVideo.getElementsByTagName('li')[0];
    
    if (oldChild) {
      currentVideo.innerText = '';
    }

    const currentVideoName = document.createTextNode(currentlyPlaying.name); 
    const currentUserName = document.createTextNode(currentlyPlaying.userFullName); 
    
    const li = document.createElement('li');
    const div = document.createElement('div');
    const input = document.createElement('input');
    input.setAttribute('value', currentlyPlaying.videoId);
    input.setAttribute('id', 'videoId');
    input.setAttribute('type', 'hidden');
    
    div.className="main--name-highlight";
    div.appendChild(currentUserName);
    li.appendChild(currentVideoName);
    li.appendChild(div);
    li.appendChild(input);
    currentVideo.appendChild(li);

    player.loadVideoById(currentlyPlaying.videoId, ellapsedSeconds);
    if (!syncActive) {
      emitSeconds(player, user.clubId);
    }
  }
  
  if (queuedVideo) {
    const upNext = document.querySelector('.main--up-next');
    const videoName = document.createTextNode(queuedVideo.name); 
    const userName = document.createTextNode(queuedVideo.userFullName); 
     
    const li = document.createElement('li');
    const div = document.createElement('div');
    div.className="main--name-highlight"
    div.appendChild(userName)
    li.appendChild(videoName);
    li.appendChild(div)
    upNext.appendChild(li);
  }
}

function updatePlaylist (data) {
  if (data.empty) {
    cancelEmitSeconds(intervalId);
    clubSocket.emit('stopSync', user.clubId);
  }

  const { 
    currentlyPlaying, 
    playlist, 
    ellapsedSeconds,
  } = data;
  let currentVideo = document.querySelector('.main--playing');
  currentVideo.innerText = '';

  const currentVideoName = document.createTextNode(currentlyPlaying.name); 
  const currentUserName = document.createTextNode(currentlyPlaying.userFullName); 
  
  const li = document.createElement('li');
  const div = document.createElement('div');
  div.className="main--name-highlight"
  div.appendChild(currentUserName)
  li.appendChild(currentVideoName);
  li.appendChild(div)
  currentVideo.appendChild(li);

  player.seekTo(ellapsedSeconds, true);
  player.cueVideoById(playlist[0].videoId);
  const upNext = document.querySelector('.main--up-next');
  upNext.innerText = ""

  playlist.forEach(video => {
    const videoName = document.createTextNode(video.name); 
    const userName = document.createTextNode(video.userFullName); 
      
    const li = document.createElement('li');
    const div = document.createElement('div');
    div.className="main--name-highlight"
    div.appendChild(userName)
    li.appendChild(videoName);
    li.appendChild(div)
    upNext.appendChild(li);
  })
}

async function onPlayerStateChange(event) {
  const upNext = document.querySelector('.main--up-next');
  const videoCount = upNext.getElementsByTagName('li').length
  if(event.data === YT.PlayerState.ENDED && videoCount > 0) {
    clubSocket.emit('playNext', user.clubId);
  }

  if(event.data === YT.PlayerState.PAUSED && videoCount > 0) {
    event.target.playVideo()
  }
}

function onPlayerError(event) {
  errorState.updateError(`Error loading video. code ${event.data}`)
  clubSocket.emit('playNext', user.clubId);
}

