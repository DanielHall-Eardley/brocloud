(()=>{var y="https://bro-cloud.herokuapp.com",T=class{constructor(){this.state={}}updateState(t){let n=t.target.name,o=t.target.value;this.state[n]=o}init(t){let n=t.children;for(let o of n)(o.nodeName==="INPUT"||o.nodeName==="SELECT")&&o.addEventListener("input",this.updateState.bind(this))}formData(){return this.state}},f={error:null,updateError(e){this.error=e;let t=document.querySelector(".error"),n=document.createTextNode(e);t.appendChild(n)},getError(){return this.error}};var I=JSON.parse(localStorage.getItem("user")),g={headers:{"Content-Type":"application/json"},method:"POST"},b=async(e,t,n)=>{if(I){let{clubId:r,_id:a}=I;g.headers.Authorization=`${a} ${r}`}t&&(g.body=JSON.stringify(t)),n&&(g.method=n);let o=await fetch(y+e,g);if(o.status>=200&&o.status<=299){let r=await o.json();return Promise.resolve(r)}f.updateError(o.error)},E={signup:async e=>{let t=await b("/signup",e);return Promise.resolve(t)},search:async e=>{let t=await b("/search",e);return Promise.resolve(t)},addVideo:async e=>{let t=await b("/addVideo",e);return Promise.resolve(t)}};var x=new T,h,C,d,v,u=JSON.parse(localStorage.getItem("user"));window.onload=()=>{let e=document.querySelector(".main--search");x.init(e),e.addEventListener("submit",F),B(),C=io(y),C.on("connect",()=>{console.log("Socket connected"),C.emit("setUpNs",u.clubId)}),d=io(`/${u.clubId}`),d.on("connect",()=>{console.log("Club NS socket connected"),A(),k()})};function A(){d.emit("setUpClub",u._id)}function k(){d.on("updateClubState",L),d.on("updatePlaylist",D),d.on("stopSync",P)}function L(e){let t=u.clubId,n=document.querySelector("#videoId");if(!n){d.emit("playNext",t);return}console.log(e),j(n.value,e.ellapsedSeconds),U(e.members)}function q(e,t){v=setInterval(()=>{let n={seconds:e.getCurrentTime(),syncActive:v,clubId:t};d.emit("updateSync",n)},1e3)}function P(e){clearInterval(e)}function B(){let t=document.querySelector(".main--history-list").getElementsByTagName("li");for(let n of t){let o=n.getAttribute("id"),r=n.getElementsByTagName("button")[0],a=r.getElementsByTagName("p")[0].innerText;w(r,null,a,o)}}function U(e){let n=document.querySelector(".main--squad-list").getElementsByTagName("li");e.forEach(o=>{for(let r of n)if(r.id.toString()===o.toString()){let a=r.getElementsByTagName("span");a[1].className="u--green-circle"}})}function j(e,t){h=new YT.Player("player",{height:"300",width:"500",videoId:e,playerVars:{cc_load_policy:0,controls:0,disablekb:1,enablejsapi:1,fs:0,modestbranding:1},events:{onReady:n=>{O(n,t)},onStateChange:R,onError:Y}})}function O(e,t){e.target.seekTo(t,!0),club.syncActive||q(e.target,u.clubId)}async function F(e){e.preventDefault();let t=x.formData(),n=await E.search(t),o=document.querySelector(".main--search-results");o.innerText="";let r=_(n.results);o.appendChild(r)}function w(e,t,n,o){e.addEventListener("click",async r=>{t&&(t.innerText="");let a={name:n,videoId:o},s=await E.addVideo(a);$(s)})}function _(e){let t=new DocumentFragment,n=document.createElement("ul");return n.className="main--result-list",e.items.forEach(o=>{let r=document.createElement("li"),a=document.createElement("button");a.className="btn--result",w(a,n,o.snippet.title,o.id.videoId);let s=document.createElement("span"),l=document.createTextNode(o.snippet.title);s.appendChild(l);let c=document.createElement("img");c.setAttribute("src",o.snippet.thumbnails.default.url),c.className="thumbnail",a.appendChild(s),a.appendChild(c),r.appendChild(a),n.appendChild(r)}),t.append(n),t}function $(e){let{currentlyPlaying:t,queuedVideo:n,syncActive:o,ellapsedSeconds:r}=e;if(!n&&t.videoId){let a=document.querySelector(".main--playing");a.getElementsByTagName("li")[0]&&(a.innerText="");let l=document.createTextNode(t.name),c=document.createTextNode(t.userFullName),i=document.createElement("li"),m=document.createElement("div"),p=document.createElement("input");p.setAttribute("value",t.videoId),p.setAttribute("id","videoId"),p.setAttribute("type","hidden"),m.className="main--name-highlight",m.appendChild(c),i.appendChild(l),i.appendChild(m),i.appendChild(p),a.appendChild(i),h.loadVideoById(t.videoId,r),o||q(h)}if(n){let a=document.querySelector(".main--up-next"),s=document.createTextNode(n.name),l=document.createTextNode(n.userFullName),c=document.createElement("li"),i=document.createElement("div");i.className="main--name-highlight",i.appendChild(l),c.appendChild(s),c.appendChild(i),a.appendChild(c)}}function D(e){e.empty&&(P(v),d.emit("stopSync",u.clubId));let{currentlyPlaying:t,playlist:n,ellapsedSeconds:o}=e,r=document.querySelector(".main--playing");r.innerText="";let a=document.createTextNode(t.name),s=document.createTextNode(t.userFullName),l=document.createElement("li"),c=document.createElement("div");c.className="main--name-highlight",c.appendChild(s),l.appendChild(a),l.appendChild(c),r.appendChild(l),h.seekTo(o,!0),h.cueVideoById(n[0].videoId);let i=document.querySelector(".main--up-next");i.innerText="",n.forEach(m=>{let p=document.createTextNode(m.name),V=document.createTextNode(m.userFullName),N=document.createElement("li"),S=document.createElement("div");S.className="main--name-highlight",S.appendChild(V),N.appendChild(p),N.appendChild(S),i.appendChild(N)})}async function R(e){let n=document.querySelector(".main--up-next").getElementsByTagName("li").length;e.data===YT.PlayerState.ENDED&&n>0&&d.emit("playNext",u.clubId),e.data===YT.PlayerState.PAUSED&&n>0&&e.target.playVideo()}function Y(e){f.updateError(`Error loading video. code ${e.data}`),d.emit("playNext",u.clubId)}})();
//# sourceMappingURL=index.js.map
