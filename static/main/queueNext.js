import { player } from './youTube'

function queueNext (data) {
  console.log(data)
  const { newVideo, previousVideo } = data
  if (newVideo) {
    player.loadVideoById(newVideo.videoId)
  }

  const upNext = document.querySelector('.main--up-next');
  const history = document.querySelector('.main--history-list');
  const children = upNext.getElementsByTagName('li');

  for (let li of children) {
    if (li.getAttribute('id').toString() == previousVideo._id.toString()) {
      upNext.removeChild(li);
      li.innerText = '';

      const hiddenInput = document.createElement('input')
      hiddenInput.setAttribute('type', 'hidden');
      hiddenInput.setAttribute('class', 'played-video');
      hiddenInput.setAttribute('value', previousVideo.videoId);

      const button = document.createElement('button')
      button.setAttribute('class', 'btn--result btn--history');

      const pName = document.createElement('p')
      pName.setAttribute('class', 'played-video--name');
      const name = document.createTextNode(previousVideo.name)
      pName.appendChild(name)

      const pUserName = document.createElement('p')
      const username = document.createTextNode(`${previousVideo.userFullName} | `)
      pUserName.appendChild(username)

      const spanTimestamp = document.createElement('span')
      spanTimestamp.setAttribute('class', 'main--timestamp');
      const timestamp = document.createTextNode(previousVideo.playedAtTime);
      spanTimestamp.appendChild(timestamp);
      
      pUserName.appendChild(spanTimestamp);
      button.appendChild(pName);
      button.appendChild(pUserName);
      li.appendChild(hiddenInput);
      li.appendChild(button);
   
      history.prepend(li);
    }
  }  
}

export default queueNext;