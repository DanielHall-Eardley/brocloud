function signupType (event, state) {
  console.log(event, state)
  const signupBtn = document.querySelector("#signup--btn");
  signupBtn.innerText = ''
  
  let text;
  if (event.key === 'clubId') {
    text = document.createTextNode(`Join club: ${event.innerText}`)
    signupBtn.setAttribute('name', 'join')
    return signupBtn.appendChild(text)
  }

  if (event.key === 'clubName') {
    text = document.createTextNode(`Create club: ${state[event.key]}`)
    signupBtn.setAttribute('name', 'create')
    return signupBtn.appendChild(text)
  }
}

export default signupType;
