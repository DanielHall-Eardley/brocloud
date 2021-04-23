(()=>{var h="https://bro-cloud.herokuapp.com",E=class{constructor(){this.state={}}updateState(t){let n=t.target.name,o=t.target.value;this.state[n]=o}init(t){let n=t.children;for(let o of n)(o.nodeName==="INPUT"||o.nodeName==="SELECT")&&o.addEventListener("input",this.updateState.bind(this))}formData(){return this.state}},g={error:null,updateError(e){this.error=e;let t=document.querySelector(".error"),n=document.createTextNode(e);t.appendChild(n),setTimeout(()=>{t.innerText=""},2e4)},getError(){return this.error}};var C=JSON.parse(localStorage.getItem("user")),y={headers:{"Content-Type":"application/json"},method:"POST"},S=async(e,t,n)=>{if(C){let{clubId:a,_id:i}=C;y.headers.Authorization=`${i} ${a}`}t&&(y.body=JSON.stringify(t)),n&&(y.method=n);let o=await fetch(h+e,y);if(o.status>=200&&o.status<=299){let a=await o.json();return Promise.resolve(a)}g.updateError(o.error)},b={signup:async e=>{let t=await S("/signup",e);return Promise.resolve(t)},search:async e=>{let t=await S("/search",e);return Promise.resolve(t)},addVideo:async e=>{let t=await S("/addVideo",e);return Promise.resolve(t)}};var T=new E,p,v,c,m,s=JSON.parse(localStorage.getItem("user"));function B(){let e={height:"300",width:"500",playerVars:{cc_load_policy:0,controls:0,disablekb:1,enablejsapi:1,fs:0,modestbranding:1},events:{onReady:V,onStateChange:w,onError:k}},t=document.querySelector("#videoId");t&&(e.videoId=t.getAttribute("value")),p=new YT.Player("player",e)}window.onload=()=>{let e=document.querySelector(".main--search");T.init(e),e.addEventListener("submit",D),A(),v=io(h),v.on("connect",()=>{console.log("Main socket connected"),v.emit("setUpNs",s.clubId)}),c=io(`/${s.clubId}`),c.on("connect",()=>{console.log("Club socket connected"),B()})};function F(){console.log("Initializing club"),c.emit("setUpClub",s._id)}function Y(e){console.log(e),document.querySelector("#videoId")&&p.seekTo(e.ellapsedSeconds,!0),x(e.members)}function _(){m=setInterval(()=>{let e={currentPosition:p.getCurrentTime(),clubId:s.clubId,userId:s._id};c.emit("updateSync",e)},500)}function A(){let t=document.querySelector(".main--history-list").getElementsByTagName("li");for(let n of t){let o=n.getAttribute("id"),a=n.getElementsByTagName("button")[0],i=a.getElementsByTagName("p")[0].innerText;P(a,null,i,o)}}function x(e){let n=document.querySelector(".main--squad-list").getElementsByTagName("li");e.forEach(o=>{for(let a of n)if(a.id.toString()===o.toString()){let i=a.getElementsByTagName("span");i[1].className="u--green-circle"}})}function U(){c.on("updateClubState",Y),c.on("updatePlaylist",$),c.on("removeLast",j),c.on("memberLeft",x),document.addEventListener("beforeunload",function(){let e=s._id,t=s.clubId;c.emit("pageClose",{userId:e,clubId:t})}),console.log("Initialized socket listeners")}function V(e){e.target.setVolume(100),console.log("Initialized youtube player"),U(),F()}async function D(e){e.preventDefault();let t=T.formData(),n=await b.search(t),o=document.querySelector(".main--search-results");o.innerText="";let a=z(n.results);o.appendChild(a)}function P(e,t,n,o){e.addEventListener("click",async a=>{t&&(t.innerText="");let i={name:n,videoId:o},d=await b.addVideo(i);O(d)})}function z(e){let t=new DocumentFragment,n=document.createElement("ul");return n.className="main--result-list",e.items.forEach(o=>{let a=document.createElement("li"),i=document.createElement("button");i.className="btn--result",P(i,n,o.snippet.title,o.id.videoId);let d=document.createElement("span"),r=document.createTextNode(o.snippet.title);d.appendChild(r);let l=document.createElement("img");l.setAttribute("src",o.snippet.thumbnails.default.url),l.className="thumbnail",i.appendChild(d),i.appendChild(l),a.appendChild(i),n.appendChild(a)}),t.append(n),t}function O(e){let{currentlyPlaying:t,queuedVideo:n}=e;if(!n&&t.videoId){let o=document.querySelector(".main--playing");o.getElementsByTagName("li")[0]&&(o.innerText="");let i=document.createTextNode(t.name),d=document.createTextNode(t.userFullName),r=document.createElement("li"),l=document.createElement("div"),u=document.createElement("input");u.setAttribute("value",t.videoId),u.setAttribute("id","videoId"),u.setAttribute("type","hidden"),l.className="main--name-highlight",l.appendChild(d),r.appendChild(i),r.appendChild(l),r.appendChild(u),o.appendChild(r),p.loadVideoById(t.videoId)}if(n){let o=document.querySelector(".main--up-next"),a=document.createTextNode(n.name),i=document.createTextNode(n.userFullName),d=document.createElement("li"),r=document.createElement("div");r.className="main--name-highlight",r.appendChild(i),d.appendChild(a),d.appendChild(r),o.appendChild(d)}}function $(e){let{currentlyPlaying:t,playlist:n,ellapsedSeconds:o}=e,a=document.querySelector(".main--playing");a.innerText="";let i=document.createTextNode(t.name),d=document.createTextNode(t.userFullName),r=document.createElement("li"),l=document.createElement("div");l.className="main--name-highlight",l.appendChild(d),r.appendChild(i),r.appendChild(l),a.appendChild(r),p.loadVideoById(t.videoId,o);let u=document.querySelector(".main--up-next");u.innerText="",n.forEach(I=>{let q=document.createTextNode(I.name),L=document.createTextNode(I.userFullName),f=document.createElement("li"),N=document.createElement("div");N.className="main--name-highlight",N.appendChild(L),f.appendChild(q),f.appendChild(N),u.appendChild(f)})}function j(){let e=document.querySelector(".main--playing");e.innerText="",clearInterval(m)}function w(e){let n=document.querySelector(".main--up-next").getElementsByTagName("li").length;e.data===YT.PlayerState.ENDED&&n>1&&(console.log(`Load next video. Status: ${e.data}`),c.emit("playNext",s.clubId),clearInterval(m)),e.data===YT.PlayerState.ENDED&&n===1&&(console.log(`Last video. Status: ${e.data}`),c.emit("removeLast",s.clubId),clearInterval(m)),e.data===YT.PlayerState.PLAYING&&_()}function k(e){let n=document.querySelector(".main--up-next").getElementsByTagName("li").length;g.updateError(`Error loading video. code ${e.data}`),n>1&&(c.emit("playNext",s.clubId),clearInterval(m)),n===1&&(c.emit("removeLast",s.clubId),clearInterval(m))}})();
//# sourceMappingURL=index.js.map
