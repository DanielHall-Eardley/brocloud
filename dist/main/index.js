(()=>{var m="https://bro-cloud.herokuapp.com",C=class{constructor(){this.state={}}updateState(t){let n=t.target.name,o=t.target.value;this.state[n]=o}init(t){let n=t.children;for(let o of n)(o.nodeName==="INPUT"||o.nodeName==="SELECT")&&o.addEventListener("input",this.updateState.bind(this))}formData(){return this.state}},p={error:null,updateError(e){this.error=e;let t=document.querySelector(".error"),n=document.createTextNode(e);t.appendChild(n),setTimeout(()=>{t.innerText=""},2e4)},getError(){return this.error}};var x=JSON.parse(localStorage.getItem("user")),h={headers:{"Content-Type":"application/json"},method:"POST"},N=async(e,t,n)=>{if(x){let{clubId:a,_id:i}=x;h.headers.Authorization=`${i} ${a}`}t&&(h.body=JSON.stringify(t)),n&&(h.method=n);let o=await fetch(m+e,h);if(o.status>=200&&o.status<=299){let a=await o.json();return Promise.resolve(a)}p.updateError(o.error)},S={signup:async e=>{let t=await N("/signup",e);return Promise.resolve(t)},search:async e=>{let t=await N("/search",e);return Promise.resolve(t)},addVideo:async e=>{let t=await N("/addVideo",e);return Promise.resolve(t)}};var P=new C,u,b,r,q,T=!1,l=JSON.parse(localStorage.getItem("user")),g=0,L;function Y(){let e={height:"300",width:"500",playerVars:{cc_load_policy:0,controls:0,disablekb:1,enablejsapi:1,fs:0,modestbranding:1},events:{onReady:D,onStateChange:F,onError:_}},t=document.querySelector("#videoId");t&&(e.videoId=t.getAttribute("value")),u=new YT.Player("player",e)}window.onload=()=>{let e=document.querySelector(".main--search");P.init(e),e.addEventListener("submit",M),j(),b=io(m),b.on("connect",()=>{console.log("Main socket connected"),b.emit("setUpNs",l.clubId)}),r=io(`/${l.clubId}`),r.on("connect",()=>{console.log("Club socket connected"),Y()})};function U(){console.log("Initializing club"),r.emit("setUpClub",l._id)}function z(e){console.log(e),L=e,document.querySelector("#videoId")&&u.seekTo(e.ellapsedSeconds,!0),k(e.members)}function O(){q=setInterval(()=>{let e={currentPosition:u.getCurrentTime(),clubId:l.clubId,userId:l._id};r.emit("updateSync",e)},500)}function j(){let t=document.querySelector(".main--history-list").getElementsByTagName("li");for(let n of t){let o=n.getAttribute("id"),a=n.getElementsByTagName("button")[0],i=a.getElementsByTagName("p")[0].innerText;w(a,null,i,o)}}function k(e){let n=document.querySelector(".main--squad-list").getElementsByTagName("li");e.forEach(o=>{for(let a of n)if(a.id.toString()===o.toString()){let i=a.getElementsByTagName("span");i[1].className="u--green-circle"}})}function G(){r.on("updateClubState",z),r.on("updatePlaylist",J),r.on("memberLeft",k),r.on("addToPlaylist",$),window.addEventListener("unload",function(){console.log("closing page");let e=l._id,t=l.clubId;r.emit("pageClose",{userId:e,clubId:t})}),r.on("syncTrack",R),console.log("Initialized socket listeners")}function R(e){g=e}function D(e){e.target.setVolume(100),console.log("Initialized youtube player"),G(),U()}async function M(e){e.preventDefault();let t=P.formData(),n=await S.search(t),o=document.querySelector(".main--search-results");o.innerText="";let a=H(n.results);o.appendChild(a)}function w(e,t,n,o){e.addEventListener("click",async a=>{t&&(t.innerText="");let i={name:n,videoId:o};await S.addVideo(i)})}function H(e){let t=new DocumentFragment,n=document.createElement("ul");return n.className="main--result-list",e.items.forEach(o=>{let a=document.createElement("li"),i=document.createElement("button");i.className="btn--result",w(i,n,o.snippet.title,o.id.videoId);let c=document.createElement("span"),s=document.createTextNode(o.snippet.title);c.appendChild(s);let d=document.createElement("img");d.setAttribute("src",o.snippet.thumbnails.default.url),d.className="thumbnail",i.appendChild(c),i.appendChild(d),a.appendChild(i),n.appendChild(a)}),t.append(n),t}function $(e){let{addTo:t,addedVideo:n}=e;if(t==="current"){let o=document.querySelector(".main--playing"),a=document.createTextNode(n.name),i=document.createTextNode(n.userFullName),c=document.createElement("li"),s=document.createElement("div"),d=document.createElement("input");d.setAttribute("value",n.videoId),d.setAttribute("id","videoId"),d.setAttribute("type","hidden"),s.className="main--name-highlight",s.appendChild(i),c.appendChild(a),c.appendChild(s),c.appendChild(d),o.appendChild(c),u.loadVideoById(n.videoId)}if(t==="queue"){let o=document.querySelector(".main--up-next"),a=document.createTextNode(n.name),i=document.createTextNode(n.userFullName),c=document.createElement("li"),s=document.createElement("div");s.className="main--name-highlight",s.appendChild(i),c.appendChild(a),c.appendChild(s),o.appendChild(c)}}function J(e){let{currentlyPlaying:t,playlist:n,ellapsedSeconds:o}=e,a=document.querySelector(".main--playing");a.innerText="";let i=document.createTextNode(t.name),c=document.createTextNode(t.userFullName),s=document.createElement("li"),d=document.createElement("div");d.className="main--name-highlight",d.appendChild(c),s.appendChild(i),s.appendChild(d),a.appendChild(s),u.loadVideoById(t.videoId,o);let I=document.querySelector(".main--up-next");I.innerText="",n.forEach(E=>{let A=document.createTextNode(E.name),B=document.createTextNode(E.userFullName),f=document.createElement("li"),y=document.createElement("div");y.className="main--name-highlight",y.appendChild(B),f.appendChild(A),f.appendChild(y),I.appendChild(f)})}function V(){let e=document.querySelector(".main--playing");e.innerText="",v()}function v(){clearInterval(q),T=!1}function F(e){let n=document.querySelector(".main--up-next").getElementsByTagName("li").length;if(e.data===YT.PlayerState.ENDED&&n>0&&(console.log("Load next video. Status: next"),r.emit("playNext",l.clubId),v()),e.data===YT.PlayerState.ENDED&&n===0&&(console.log("Last video. Status: finished"),r.emit("removeLast",l.clubId),V()),e.data===YT.PlayerState.PLAYING){if(L.members[0].toString()===l._id.toString())O();else if(!T){let a=e.target.getCurrentTime();(g>a||g<a)&&(e.target.seekTo(g,!0),T=!0)}}}function _(e){let n=document.querySelector(".main--up-next").getElementsByTagName("li").length;p.updateError(`Error loading video. code ${e.data}`),n>1&&(r.emit("playNext",l.clubId),v()),n===1&&(r.emit("removeLast",l.clubId),V())}})();
//# sourceMappingURL=index.js.map
