(()=>{var r="https://brocloud.ca",a=class{constructor(t=null){this.state={},this.customFn=t}updateState(t,o){this.state[t]=o}eventListener(t){let o=t.target.name,s=t.target.value;this.updateState.apply(this,[o,s])}init(t){let o=t.children;for(let s of o)(s.nodeName==="INPUT"||s.nodeName==="SELECT")&&s.addEventListener("input",this.eventListener.bind(this))}formData(){return this.state}},c=e=>{let t=document.querySelector(".error"),o=document.createTextNode(`${e.message}. Status: ${e.status}`);t.appendChild(o),setTimeout(()=>{t.innerText=""},2e4)},i=e=>{localStorage.setItem("user",JSON.stringify(e))},d=e=>{window.location.replace(`${r}/music/${e.clubId}/${e._id}`)};})();
//# sourceMappingURL=global.js.map
