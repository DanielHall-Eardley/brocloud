(()=>{var m="https://bro-cloud.herokuapp.com",E=class{constructor(){this.state={}}updateState(t){let n=t.target.name,o=t.target.value;this.state[n]=o}init(t){let n=t.children;for(let o of n)(o.nodeName==="INPUT"||o.nodeName==="SELECT")&&o.addEventListener("input",this.updateState.bind(this))}formData(){return this.state}},p={error:null,updateError(e){this.error=e;let t=document.querySelector(".error"),n=document.createTextNode(e);t.appendChild(n),setTimeout(()=>{t.innerText=""},2e4)},getError(){return this.error}};var C=JSON.parse(localStorage.getItem("user")),h={headers:{"Content-Type":"application/json"},method:"POST"},N=async(e,t,n)=>{if(C){let{clubId:a,_id:i}=C;h.headers.Authorization=`${i} ${a}`}t&&(h.body=JSON.stringify(t)),n&&(h.method=n);let o=await fetch(m+e,h);if(o.status>=200&&o.status<=299){let a=await o.json();return Promise.resolve(a)}p.updateError(o.error)},S={signup:async e=>{let t=await N("/signup",e);return Promise.resolve(t)},search:async e=>{let t=await N("/search",e);return Promise.resolve(t)},addVideo:async e=>{let t=await N("/addVideo",e);return Promise.resolve(t)}};var x=new E,u,b,s,P,q,l=JSON.parse(localStorage.getItem("user")),g=0,L;function Y(){let e={height:"300",width:"500",playerVars:{cc_load_policy:0,controls:0,disablekb:1,enablejsapi:1,fs:0,modestbranding:1},events:{onReady:D,onStateChange:F,onError:_}},t=document.querySelector("#videoId");t&&(e.videoId=t.getAttribute("value")),u=new YT.Player("player",e)}window.onload=()=>{let e=document.querySelector(".main--search");x.init(e),e.addEventListener("submit",M),j(),b=io(m),b.on("connect",()=>{console.log("Main socket connected"),b.emit("setUpNs",l.clubId)}),s=io(`/${l.clubId}`),s.on("connect",()=>{console.log("Club socket connected"),Y()})};function U(){console.log("Initializing club"),s.emit("setUpClub",l._id)}function z(e){console.log(e),L=e,document.querySelector("#videoId")&&u.seekTo(e.ellapsedSeconds,!0),k(e.members)}function O(){P=setInterval(()=>{let e={currentPosition:u.getCurrentTime(),clubId:l.clubId,userId:l._id};s.emit("updateSync",e)},500)}function j(){let t=document.querySelector(".main--history-list").getElementsByTagName("li");for(let n of t){let o=n.getAttribute("id"),a=n.getElementsByTagName("button")[0],i=a.getElementsByTagName("p")[0].innerText;w(a,null,i,o)}}function k(e){let n=document.querySelector(".main--squad-list").getElementsByTagName("li");e.forEach(o=>{for(let a of n)if(a.id.toString()===o.toString()){let i=a.getElementsByTagName("span");i[1].className="u--green-circle"}})}function J(){s.on("updateClubState",z),s.on("updatePlaylist",$),s.on("memberLeft",k),window.addEventListener("unload",function(){console.log("closing page");let e=l._id,t=l.clubId;s.emit("pageClose",{userId:e,clubId:t})}),s.on("syncTrack",R),console.log("Initialized socket listeners")}function R(e){g=e}function D(e){e.target.setVolume(100),console.log("Initialized youtube player"),J(),U()}async function M(e){e.preventDefault();let t=x.formData(),n=await S.search(t),o=document.querySelector(".main--search-results");o.innerText="";let a=G(n.results);o.appendChild(a)}function w(e,t,n,o){e.addEventListener("click",async a=>{t&&(t.innerText="");let i={name:n,videoId:o},r=await S.addVideo(i);H(r)})}function G(e){let t=new DocumentFragment,n=document.createElement("ul");return n.className="main--result-list",e.items.forEach(o=>{let a=document.createElement("li"),i=document.createElement("button");i.className="btn--result",w(i,n,o.snippet.title,o.id.videoId);let r=document.createElement("span"),c=document.createTextNode(o.snippet.title);r.appendChild(c);let d=document.createElement("img");d.setAttribute("src",o.snippet.thumbnails.default.url),d.className="thumbnail",i.appendChild(r),i.appendChild(d),a.appendChild(i),n.appendChild(a)}),t.append(n),t}function H(e){let{currentlyPlaying:t,queuedVideo:n}=e;if(!n&&t){let o=document.querySelector(".main--playing"),a=document.createTextNode(t.name),i=document.createTextNode(t.userFullName),r=document.createElement("li"),c=document.createElement("div"),d=document.createElement("input");d.setAttribute("value",t.videoId),d.setAttribute("id","videoId"),d.setAttribute("type","hidden"),c.className="main--name-highlight",c.appendChild(i),r.appendChild(a),r.appendChild(c),r.appendChild(d),o.appendChild(r),u.loadVideoById(t.videoId)}if(n){let o=document.querySelector(".main--up-next"),a=document.createTextNode(n.name),i=document.createTextNode(n.userFullName),r=document.createElement("li"),c=document.createElement("div");c.className="main--name-highlight",c.appendChild(i),r.appendChild(a),r.appendChild(c),o.appendChild(r)}}function $(e){let{currentlyPlaying:t,playlist:n,ellapsedSeconds:o}=e,a=document.querySelector(".main--playing");a.innerText="";let i=document.createTextNode(t.name),r=document.createTextNode(t.userFullName),c=document.createElement("li"),d=document.createElement("div");d.className="main--name-highlight",d.appendChild(r),c.appendChild(i),c.appendChild(d),a.appendChild(c),u.loadVideoById(t.videoId,o);let v=document.querySelector(".main--up-next");v.innerText="",n.forEach(T=>{let A=document.createTextNode(T.name),B=document.createTextNode(T.userFullName),y=document.createElement("li"),f=document.createElement("div");f.className="main--name-highlight",f.appendChild(B),y.appendChild(A),y.appendChild(f),v.appendChild(y)})}function V(){let e=document.querySelector(".main--playing");e.innerText="",I()}function I(){clearInterval(P),clearInterval(q)}function F(e){let n=document.querySelector(".main--up-next").getElementsByTagName("li").length;e.data===YT.PlayerState.ENDED&&n>0&&(console.log("Load next video. Status: next"),s.emit("playNext",l.clubId),I()),e.data===YT.PlayerState.ENDED&&n===0&&(console.log("Last video. Status: finished"),s.emit("removeLast",l.clubId),V()),e.data===YT.PlayerState.PLAYING&&(L.members[0].toString()===l._id.toString()?O():q=setInterval(()=>{let a=e.target.getCurrentTime();(g>a||g<a)&&e.target.seekTo(g,!0)},6e4))}function _(e){let n=document.querySelector(".main--up-next").getElementsByTagName("li").length;p.updateError(`Error loading video. code ${e.data}`),n>1&&(s.emit("playNext",l.clubId),I()),n===1&&(s.emit("removeLast",l.clubId),V())}})();
//# sourceMappingURL=index.js.map
