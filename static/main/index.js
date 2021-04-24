import { FormState, errorState, host } from '../common/global.js';
import api from '../common/api';
const formState = new FormState()

let player;
let mainSocket;
let clubSocket;
let intervalId;
let syncIntervalId;
const user = JSON.parse(localStorage.getItem('user'));
let trackPosition = 0;

function onYouTubeIframeAPIReady() {
  const options = {
    height: '300',
    width: '500',
    playerVars: {
      cc_load_policy: 0,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      modestbranding: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  }

  const videoId = document.querySelector('#videoId');
  if (videoId) {
    options.videoId = videoId.getAttribute('value');
  }
  player = new YT.Player('player', options)
}

window.onload = () => {
  const form = document.querySelector('.main--search');
  formState.init(form);
  form.addEventListener('submit', formSubmit);
  addHistoryListeners()
  
  mainSocket = io(host)
  mainSocket.on('connect', () => {
    console.log('Main socket connected');
    mainSocket.emit('setUpNs', user.clubId);
  })

  clubSocket = io(`/${user.clubId}`)
  clubSocket.on('connect', () => {
    console.log('Club socket connected');
    onYouTubeIframeAPIReady()
  })
};

function emitClubInfo () {
  console.log('Initializing club');
  clubSocket.emit('setUpClub', user._id)
}

function updateClubState (club) {
  console.log(club);
  const videoId = document.querySelector('#videoId');
  if (videoId) {
    player.seekTo(club.ellapsedSeconds, true);
  }
  updateMembers(club.members); 
}

function emitSeconds () {
  intervalId = setInterval(() => {
    const data = {
      currentPosition: player.getCurrentTime(),
      clubId: user.clubId,
      userId: user._id
    }

    clubSocket.emit('updateSync', data);
  }, 500)
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

function initSocket () {
  clubSocket.on('updateClubState', updateClubState)
  clubSocket.on('updatePlaylist', updatePlaylist);
  clubSocket.on('memberLeft', updateMembers);
  document.addEventListener("beforeunload", function() {
    const userId = user._id;
    const clubId = user.clubId;
    clubSocket.emit('pageClose', {userId, clubId})
  });
  clubSocket.on('syncTrack', updateTrackPosition)
  console.log('Initialized socket listeners');
}

function updateTrackPosition (position) {
  trackPosition = position
}

function onPlayerReady (event) {
  event.target.setVolume(100)
  console.log('Initialized youtube player');
  initSocket()
  emitClubInfo()
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
   } = data;
  
  if (!queuedVideo && currentlyPlaying) {
    let currentVideo = document.querySelector('.main--playing');
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

    player.loadVideoById(currentlyPlaying.videoId);
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
  
  player.loadVideoById(currentlyPlaying.videoId, ellapsedSeconds)

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

function removeLast () {
  let currentVideo = document.querySelector('.main--playing');
  currentVideo.innerText = '';
  stopSync()
}

function stopSync () {
  clearInterval(intervalId)
  clearInterval(syncIntervalId);
}

function onPlayerStateChange(event) {
  const upNext = document.querySelector('.main--up-next');
  const videoCount = upNext.getElementsByTagName('li').length

  if(event.data === YT.PlayerState.ENDED && videoCount > 0) {
    console.log('Load next video. Status: next');
    clubSocket.emit('playNext', user.clubId);
    stopSync()
  }

  if(
    event.data === YT.PlayerState.ENDED && 
    videoCount === 0
  ) {
    console.log('Last video. Status: finished');
    clubSocket.emit('removeLast', user.clubId);
    removeLast()
  }

  if(event.data === YT.PlayerState.PLAYING) {
    emitSeconds();
    syncIntervalId = setInterval(() => {
      if (trackPosition > event.target.getCurrentTime()) {
        event.target.seekTo(trackPosition, true)
      }
    }, 10000)
  }
}

function onPlayerError(event) {
  const upNext = document.querySelector('.main--up-next');
  const videoCount = upNext.getElementsByTagName('li').length
  errorState.updateError(`Error loading video. code ${event.data}`)

  if(videoCount > 1) {
    clubSocket.emit('playNext', user.clubId);
    stopSync()
  }

  if(videoCount === 1) {
    clubSocket.emit('removeLast', user.clubId);
    removeLast()
  }  
};

