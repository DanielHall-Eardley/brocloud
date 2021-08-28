(()=>{var k="https://bro-cloud.herokuapp.com",L=class{constructor(t=null){this.state={},this.customFn=t}updateState(t,o){this.state[t]=o}eventListener(t){let o=t.target.name,n=t.target.value,r=t.target.innerText;this.updateState.apply(this,[o,n]),this.customFn&&this.customFn({key:o,value:n,innerText:r},this.state)}init(t,o){let n=t.children;for(let r of n)(r.nodeName==="INPUT"||r.nodeName==="SELECT")&&r.addEventListener("input",this.eventListener.bind(this));if(o){let{identifier:r,childElementType:i,eventType:s}=o,a=document.querySelector(r).getElementsByTagName(i);for(let p of a)p.addEventListener(s,this.eventListener.bind(this))}}formData(){return this.state}},u=e=>{let t=document.querySelector(".error"),o=document.createTextNode(e);t.appendChild(o),setTimeout(()=>{t.innerText=""},2e4)};function z(e){let t=e.video,o=document.querySelector(".main--up-next"),n=o.getElementsByTagName("li").length;n===0&&l.loadVideoById(t.videoId);let r=document.createTextNode(t.name),i=document.createTextNode(t.userFullName),s=document.createElement("li");s.setAttribute("id",t._id);let c=document.createElement("div");c.className="main--name-highlight";let a=document.createElement("input");a.setAttribute("type","hidden"),a.setAttribute("value",t.videoId),n===0?a.setAttribute("id","current-video"):a.setAttribute("class","next-video"),c.appendChild(i),s.appendChild(r),s.appendChild(c),o.appendChild(s)}var q=z;function H(e){let o=document.querySelector(".main--squad-list").getElementsByTagName("li");for(let n of o){let r=n.getElementsByTagName("span");r[1].className="u--red-circle"}e.forEach(n=>{for(let r of o)if(r.id.toString()===n.toString()){let i=r.getElementsByTagName("span");i[1].className="u--green-circle"}})}var f=H;var v;function J(e){console.log(e),v=e,document.querySelector("#current-video")&&l.seekTo(e.ellapsedSeconds,!0),f(e.members)}var P=J;function G(e){console.log(e);let{newVideo:t,previousVideo:o}=e;t&&l.loadVideoById(t.videoId);let n=document.querySelector(".main--up-next"),r=document.querySelector(".main--history-list"),i=n.getElementsByTagName("li");for(let s of i)if(s.getAttribute("id").toString()==o._id.toString()){n.removeChild(s),s.innerText="";let c=document.createElement("input");c.setAttribute("type","hidden"),c.setAttribute("class","played-video"),c.setAttribute("value",o.videoId);let a=document.createElement("button");a.setAttribute("class","btn--result btn--history");let p=document.createElement("p");p.setAttribute("class","played-video--name");let Y=document.createTextNode(o.name);p.appendChild(Y);let S=document.createElement("p"),$=document.createTextNode(`${o.userFullName} | `);S.appendChild($);let T=document.createElement("span");T.setAttribute("class","main--timestamp");let O=document.createTextNode(o.playedAtTime);T.appendChild(O),S.appendChild(T),a.appendChild(p),a.appendChild(S),s.appendChild(c),s.appendChild(a),r.prepend(s)}}var A=G;function K(){let e=JSON.parse(localStorage.getItem("user"));return e||u("No user logged in"),e}var m=K;var Q=m(),V,x=!1,y=0;function w(){if(v.members[0].toString()===Q._id.toString())W();else if(!x){let t=l.getCurrentTime();(y>t||y<t)&&(l.seekTo(y,!0),x=!0)}}function N(){clearInterval(V),x=!1}function W(){V=setInterval(()=>{let e={currentPosition:l.getCurrentTime()};d.emit("updateSync",e)},500)}function B(e){y=e}function X(){d.on("updateClubState",P),d.on("queueNext",A),d.on("memberLeft",f),d.on("addToPlaylist",q),d.on("syncTrack",B),console.log("Initialized socket listeners"),d.emit("setupClub")}var F=X;var Me=m(),l;function Z(){let e={height:"300",width:"500",playerVars:{cc_load_policy:0,disablekb:1,enablejsapi:1,fs:0,modestbranding:1},events:{onReady:ee,onStateChange:te,onError:oe}},t=document.querySelector("#current-video");t&&(e.videoId=t.getAttribute("value")),l=new YT.Player("player",e)}function ee(e){e.target.setVolume(100),console.log("Initialized youtube player"),F()}function te(e){e.data===YT.PlayerState.ENDED&&(console.log("Load next video"),d.emit("queueNext"),N()),e.data===YT.PlayerState.PLAYING&&w()}function oe(e){d.emit("queueNext"),u(`Error loading video. code ${e.data}`),N()}var U=Z;var E=m(),d;function ne(){d=io(`/${E.clubId}`,{query:{userId:E._id,clubId:E.clubId}}),d.on("connect",()=>{console.log("Club socket connected"),U()})}var M=ne;var _=JSON.parse(localStorage.getItem("user")),h={headers:{"Content-Type":"application/json"},method:"POST"},C=async(e,t,o)=>{if(_){let{clubId:r,_id:i}=_;h.headers.Authorization=`${i} ${r}`}t&&(h.body=JSON.stringify(t)),o&&(h.method=o);let n=await fetch(k+e,h);if(n.status>=200&&n.status<=299){let r=await n.json();return Promise.resolve(r)}u(n.error)},b={signup:async e=>{let t=await C(`/signup/${e.url}`,e.body);return Promise.resolve(t)},search:async e=>{let t=await C("/youtube-api/search",e);return Promise.resolve(t)},addVideo:async e=>{let t=await C("/music/addVideo",e);return Promise.resolve(t)}};function re(e,t,o,n){e.addEventListener("click",async r=>{t&&(t.innerText="");let i={name:o,videoId:n};await b.addVideo(i)})}var g=re;function ie(){let t=document.querySelector(".main--history-list").getElementsByTagName("li");for(let o of t){let n=o.querySelector(".played-video").value,r=o.getElementsByTagName("button")[0],i=r.querySelector(".played-video--name").innerText;g(r,null,i,n)}}var j=ie;function se(e){let t=new DocumentFragment,o=document.createElement("ul");return o.className="main--result-list",e.items.forEach(n=>{let r=document.createElement("li"),i=document.createElement("button");i.className="btn--result",g(i,o,n.snippet.title,n.id.videoId);let s=document.createElement("span"),c=document.createTextNode(n.snippet.title);s.appendChild(c);let a=document.createElement("img");a.setAttribute("src",n.snippet.thumbnails.default.url),a.className="thumbnail",i.appendChild(s),i.appendChild(a),r.appendChild(i),o.appendChild(r)}),t.append(o),t}var D=se;async function ae(e){e.preventDefault();let t=I.formData(),o=await b.search(t),n=document.querySelector(".main--search-results");n.innerText="";let r=D(o.results);n.appendChild(r)}var R=ae;var I=new L;window.onload=()=>{let e=document.querySelector(".main--search");I.init(e),e.addEventListener("submit",R),j(),M()};})();
//# sourceMappingURL=index.js.map
