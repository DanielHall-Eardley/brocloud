(()=>{var s="https://bro-cloud.herokuapp.com",n=class{constructor(t=null){this.state={},this.customFn=t}updateState(t,o){this.state[t]=o}eventListener(t){let o=t.target.name,r=t.target.value;this.updateState.apply(this,[o,r])}init(t){let o=t.children;for(let r of o)(r.nodeName==="INPUT"||r.nodeName==="SELECT")&&r.addEventListener("input",this.eventListener.bind(this))}formData(){return this.state}},c=e=>{let t=document.querySelector(".error"),o=document.createTextNode(e);t.appendChild(o),setTimeout(()=>{t.innerText=""},2e4)},i=e=>{localStorage.setItem("user",JSON.stringify(e))},d=e=>{window.location.replace(`${s}/music/${e.clubId}/${e._id}`)};})();
//# sourceMappingURL=global.js.map
