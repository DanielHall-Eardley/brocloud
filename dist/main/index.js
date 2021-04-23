(()=>{var m="https://bro-cloud.herokuapp.com",E=class{constructor(){this.state={}}updateState(e){let o=e.target.name,n=e.target.value;this.state[o]=n}init(e){let o=e.children;for(let n of o)(n.nodeName==="INPUT"||n.nodeName==="SELECT")&&n.addEventListener("input",this.updateState.bind(this))}formData(){return this.state}},p={error:null,updateError(t){this.error=t;let e=document.querySelector(".error"),o=document.createTextNode(t);e.appendChild(o)},getError(){return this.error}};var v=JSON.parse(localStorage.getItem("user")),h={headers:{"Content-Type":"application/json"},method:"POST"},N=async(t,e,o)=>{if(v){let{clubId:a,_id:r}=v;h.headers.Authorization=`${r} ${a}`}e&&(h.body=JSON.stringify(e)),o&&(h.method=o);let n=await fetch(m+t,h);if(n.status>=200&&n.status<=299){let a=await n.json();return Promise.resolve(a)}p.updateError(n.error)},f={signup:async t=>{let e=await N("/signup",t);return Promise.resolve(e)},search:async t=>{let e=await N("/search",t);return Promise.resolve(e)},addVideo:async t=>{let e=await N("/addVideo",t);return Promise.resolve(e)}};var T=new E,S,b,d,u=JSON.parse(localStorage.getItem("user"));window.onload=()=>{let t=document.querySelector(".main--search");T.init(t),t.addEventListener("submit",k),V(),b=io(m),b.on("connect",()=>{console.log("Socket connected"),b.emit("setUpNs",u.clubId)}),d=io(`/${u.clubId}`),d.on("connect",()=>{console.log("Club NS socket connected"),q(),w()})};function q(){d.emit("setUpClub",u._id)}function w(){d.on("updateClubState",B),d.on("updatePlaylist",F)}function B(t){let e=u._id,o=u.clubId,n=document.querySelector("#videoId");if(!n){d.emit("playNext",o);return}A(n.value,t.ellapsedSeconds),L(t.members),e===t.members[0]&&setInterval(()=>{let a={seconds:S.getCurrentTime(),clubId:o};d.emit("updateSeconds",a)},1e3)}function V(){let e=document.querySelector(".main--history-list").getElementsByTagName("li");for(let o of e){let n=o.getAttribute("id"),a=o.getElementsByTagName("button")[0],r=a.getElementsByTagName("p")[0].innerText;x(a,null,r,n)}}function L(t){let o=document.querySelector(".main--squad-list").getElementsByTagName("li");t.forEach(n=>{for(let a of o)if(a.id.toString()===n.toString()){let r=a.getElementsByTagName("span");r[1].className="u--green-circle"}})}function A(t,e){S=new YT.Player("player",{height:"300",width:"500",videoId:t,playerVars:{cc_load_policy:0,autoplay:1,controls:0,disablekb:1,enablejsapi:1,fs:0,modestbranding:1,start:e},events:{onStateChange:D,onError:j}})}async function k(t){t.preventDefault();let e=T.formData(),o=await f.search(e),n=document.querySelector(".main--search-results");n.innerText="";let a=U(o.results);n.appendChild(a)}function x(t,e,o,n){t.addEventListener("click",async a=>{e&&(e.innerText="");let r={name:o,videoId:n},c=await f.addVideo(r);_(c)})}function U(t){let e=new DocumentFragment,o=document.createElement("ul");return o.className="main--result-list",t.items.forEach(n=>{let a=document.createElement("li"),r=document.createElement("button");r.className="btn--result",x(r,o,n.snippet.title,n.id.videoId);let c=document.createElement("span"),i=document.createTextNode(n.snippet.title);c.appendChild(i);let s=document.createElement("img");s.setAttribute("src",n.snippet.thumbnails.default.url),s.className="thumbnail",r.appendChild(c),r.appendChild(s),a.appendChild(r),o.appendChild(a)}),e.append(o),e}function _(t){let{currentlyPlaying:e,queuedVideo:o}=t;if(!o&&e.videoId){let n=document.querySelector(".main--playing");n.getElementsByTagName("li")[0]&&(n.innerText="");let r=document.createTextNode(e.name),c=document.createTextNode(e.userFullName),i=document.createElement("li"),s=document.createElement("div"),l=document.createElement("input");l.setAttribute("value",e.videoId),l.setAttribute("id","videoId"),l.setAttribute("type","hidden"),s.className="main--name-highlight",s.appendChild(c),i.appendChild(r),i.appendChild(s),i.appendChild(l),n.appendChild(i)}if(o){let n=document.querySelector(".main--up-next"),a=document.createTextNode(o.name),r=document.createTextNode(o.userFullName),c=document.createElement("li"),i=document.createElement("div");i.className="main--name-highlight",i.appendChild(r),c.appendChild(a),c.appendChild(i),n.appendChild(c)}}function F(t){let{currentlyPlaying:e,playlist:o,seconds:n}=t,a=document.querySelector(".main--playing");a.innerText="";let r=document.createTextNode(e.name),c=document.createTextNode(e.userFullName),i=document.createElement("li"),s=document.createElement("div");s.className="main--name-highlight",s.appendChild(c),i.appendChild(r),i.appendChild(s),a.appendChild(i),S.loadVideoById(e.videoId,n);let l=document.querySelector(".main--up-next");l.innerText="",o.forEach(C=>{let I=document.createTextNode(C.name),P=document.createTextNode(C.userFullName),y=document.createElement("li"),g=document.createElement("div");g.className="main--name-highlight",g.appendChild(P),y.appendChild(I),y.appendChild(g),l.appendChild(y)})}async function D(t){let o=document.querySelector(".main--up-next").getElementsByTagName("li").length;t.data===YT.PlayerState.ENDED&&o>0&&d.emit("playNext",u.clubId)}function j(t){p.updateError(`Error loading video. code ${t.data}`),d.emit("playNext",u.clubId)}})();
//# sourceMappingURL=index.js.map
