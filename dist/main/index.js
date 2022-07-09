(()=>{var k="https://bro-cloud.herokuapp.com",L=class{constructor(t=null){this.state={},this.customFn=t}updateState(t,o){this.state[t]=o}eventListener(t){let o=t.target.name,n=t.target.value;this.updateState.apply(this,[o,n])}init(t){let o=t.children;for(let n of o)(n.nodeName==="INPUT"||n.nodeName==="SELECT")&&n.addEventListener("input",this.eventListener.bind(this))}formData(){return this.state}},u=e=>{let t=document.querySelector(".error"),o=document.createTextNode(e);t.appendChild(o),setTimeout(()=>{t.innerText=""},2e4)};function O(e){let t=e.video,o=document.querySelector(".main--up-next"),n=o.getElementsByTagName("li").length;n===0&&c.loadVideoById(t.videoId);let r=document.createTextNode(t.name),i=document.createTextNode(t.userFullName),s=document.createElement("li");s.setAttribute("id",t._id);let l=document.createElement("div");l.className="main--name-highlight";let d=document.createElement("input");d.setAttribute("type","hidden"),d.setAttribute("value",t.videoId),n===0?d.setAttribute("id","current-video"):d.setAttribute("class","next-video"),l.appendChild(i),s.appendChild(r),s.appendChild(l),o.appendChild(s)}var P=O;function z(e){let o=document.querySelector(".main--squad-list").getElementsByTagName("li");for(let n of o){let r=n.getElementsByTagName("span");r[1].className="u--red-circle"}e.forEach(n=>{for(let r of o)if(r.id.toString()===n.toString()){let i=r.getElementsByTagName("span");i[1].className="u--green-circle"}})}var p=z;var x;function H(e){console.log(e),x=e,document.querySelector("#current-video")&&c.seekTo(e.ellapsedSeconds,!0),p(e.members)}var q=H;function G(e){console.log(e);let{newVideo:t,previousVideo:o}=e;t&&c.loadVideoById(t.videoId);let n=document.querySelector(".main--up-next"),r=document.querySelector(".main--history-list"),i=n.getElementsByTagName("li");for(let s of i)if(s.getAttribute("id").toString()==o._id.toString()){n.removeChild(s),s.innerText="";let l=document.createElement("input");l.setAttribute("type","hidden"),l.setAttribute("class","played-video"),l.setAttribute("value",o.videoId);let d=document.createElement("button");d.setAttribute("class","btn--result btn--history");let S=document.createElement("p");S.setAttribute("class","played-video--name");let R=document.createTextNode(o.name);S.appendChild(R);let v=document.createElement("p"),Y=document.createTextNode(`${o.userFullName} | `);v.appendChild(Y);let T=document.createElement("span");T.setAttribute("class","main--timestamp");let J=document.createTextNode(o.playedAtTime);T.appendChild(J),v.appendChild(T),d.appendChild(S),d.appendChild(v),s.appendChild(l),s.appendChild(d),r.prepend(s)}}var A=G;function K(){let e=JSON.parse(localStorage.getItem("user"));return e||u("No user logged in"),e}var m=K;var Q=m(),V,N=!1,f=0;function w(){if(x.members[0].toString()===Q._id.toString())W();else if(!N){let t=c.getCurrentTime();(f>t||f<t)&&(c.seekTo(f,!0),N=!0)}}function C(){clearInterval(V),N=!1}function W(){V=setInterval(()=>{let e={currentPosition:c.getCurrentTime()};a.emit("updateSync",e)},500)}function B(e){f=e}function X(){a.on("updateClubState",q),a.on("queueNext",A),a.on("memberLeft",p),a.on("addToPlaylist",P),a.on("syncTrack",B),console.log("Initialized socket listeners"),a.emit("setupClub")}var U=X;var Fe=m(),c;function Z(){let e={height:"300",width:"500",playerVars:{cc_load_policy:0,controls:0,disablekb:1,enablejsapi:1,fs:0,modestbranding:1},events:{onReady:ee,onStateChange:te,onError:oe}},t=document.querySelector("#current-video");t&&(e.videoId=t.getAttribute("value")),c=new YT.Player("player",e)}function ee(e){e.target.setVolume(100),console.log("Initialized youtube player"),U()}function te(e){e.data===YT.PlayerState.ENDED&&(console.log("Load next video"),a.emit("queueNext"),C()),e.data===YT.PlayerState.PLAYING&&w()}function oe(e){a.emit("queueNext"),u(`Error loading video. code ${e.data}`),C()}var j=Z;var E=m(),a;function ne(){a=io(`/${E.clubId}`,{query:{userId:E._id,clubId:E.clubId}}),a.on("connect",()=>{console.log("Club socket connected"),j()})}var F=ne;var M=JSON.parse(localStorage.getItem("user")),y={headers:{"Content-Type":"application/json"},method:"POST"},b=async(e,t,o)=>{if(M){let{clubId:r,_id:i}=M;y.headers.Authorization=`${i} ${r}`}t&&(y.body=JSON.stringify(t)),o&&(y.method=o);let n=await fetch(k+e,y);if(n.status>=200&&n.status<=299){let r=await n.json();return Promise.resolve(r)}u(n.error)},h={signupJoin:async(e,t)=>{let o=await b(`/signup/join/${t}`,e);return Promise.resolve(o)},signupCreate:async(e,t)=>{let o=await b(`/signup/create/${t}`,e);return Promise.resolve(o)},search:async e=>{let t=await b("/youtube-api/search",e);return Promise.resolve(t)},addVideo:async e=>{let t=await b("/music/addVideo",e);return Promise.resolve(t)}};function re(e,t,o,n){e.addEventListener("click",async r=>{t&&(t.innerText="");let i={name:o,videoId:n};await h.addVideo(i)})}var g=re;function ie(){let t=document.querySelector(".main--history-list").getElementsByTagName("li");for(let o of t){let n=o.querySelector(".played-video").value,r=o.getElementsByTagName("button")[0],i=r.querySelector(".played-video--name").innerText;g(r,null,i,n)}}var _=ie;function se(e){let t=new DocumentFragment,o=document.createElement("ul");return o.className="main--result-list",e.items.forEach(n=>{let r=document.createElement("li"),i=document.createElement("button");i.className="btn--result",g(i,o,n.snippet.title,n.id.videoId);let s=document.createElement("span"),l=document.createTextNode(n.snippet.title);s.appendChild(l);let d=document.createElement("img");d.setAttribute("src",n.snippet.thumbnails.default.url),d.className="thumbnail",i.appendChild(s),i.appendChild(d),r.appendChild(i),o.appendChild(r)}),t.append(o),t}var $=se;async function ae(e){e.preventDefault();let t=I.formData(),o=await h.search(t),n=document.querySelector(".main--search-results");n.innerText="";let r=$(o.results);n.appendChild(r)}var D=ae;var I=new L;window.onload=()=>{let e=document.querySelector(".main--search");I.init(e),e.addEventListener("submit",D),_(),F()};})();
//# sourceMappingURL=index.js.map
