(()=>{var N="http://localhost:3000",E=class{constructor(t=null){this.state={},this.customFn=t}updateState(t,o){this.state[t]=o}eventListener(t){let o=t.target.name,r=t.target.value,n=t.target.innerText;this.updateState.apply(this,[o,r]),this.customFn&&this.customFn({key:o,value:r,innerText:n},this.state)}init(t,o){let r=t.children;for(let n of r)(n.nodeName==="INPUT"||n.nodeName==="SELECT")&&n.addEventListener("input",this.eventListener.bind(this));if(o){let{identifier:n,childElementType:i,eventType:a}=o,c=document.querySelector(n).getElementsByTagName(i);for(let Y of c)Y.addEventListener(a,this.eventListener.bind(this))}}formData(){return this.state}},m=e=>{let t=document.querySelector(".error"),o=document.createTextNode(e);t.appendChild(o),setTimeout(()=>{t.innerText=""},2e4)};function j(e){let t=e.video,o=document.querySelector(".main--up-next"),r=o.getElementsByTagName("li").length;r===0&&d.loadVideoById(t.videoId);let n=document.createTextNode(t.name),i=document.createTextNode(t.userFullName),a=document.createElement("li");a.setAttribute("id",t._id);let u=document.createElement("div");u.className="main--name-highlight";let c=document.createElement("input");c.setAttribute("type","hidden"),c.setAttribute("value",t.videoId),r===0?c.setAttribute("id","current-video"):c.setAttribute("class","next-video"),u.appendChild(i),a.appendChild(n),a.appendChild(u),o.appendChild(a)}var C=j;function $(e){let o=document.querySelector(".main--squad-list").getElementsByTagName("li");e.forEach(r=>{for(let n of o)if(n.id.toString()===r.toString()){let i=n.getElementsByTagName("span");i[1].className="u--green-circle"}})}var p=$;var b;function O(e){console.log(e),b=e,document.querySelector("#current-video")&&d.seekTo(e.ellapsedSeconds,!0),p(e.members)}var L=O;function z(e){console.log(e);let{newVideo:t,previousVideoId:o}=e;t&&d.loadVideoById(t.videoId);let r=document.querySelector(".main--up-next"),n=document.querySelector(".main--history-list"),i=r.getElementsByTagName("li");for(let a of i)a.getAttribute("id").toString()==o.toString()&&(r.removeChild(a),n.prepend(a))}var k=z;function H(){let e=JSON.parse(localStorage.getItem("user"));return e||m("No user logged in"),e}var l=H;var S=l(),q,v=!1,f=0;function P(){if(b.members[0].toString()===S._id.toString())J();else if(!v){let t=d.getCurrentTime();(f>t||f<t)&&(d.seekTo(f,!0),v=!0)}}function T(){clearInterval(q),v=!1}function J(){q=setInterval(()=>{let e={currentPosition:d.getCurrentTime(),clubId:S.clubId,userId:S._id};s.emit("updateSync",e)},500)}function V(e){f=e}var w=l();function G(){let e={userId:w._id,clubId:w.clubId};s.on("updateClubState",L),s.on("queueNext",k),s.on("memberLeft",p),s.on("addToPlaylist",C),window.addEventListener("unload",function(){console.log("closing page"),s.emit("pageClose",e)}),s.on("syncTrack",V),console.log("Initialized socket listeners"),s.emit("setupClub",e)}var A=G;var U=l(),d;function X(){let e={height:"300",width:"500",playerVars:{cc_load_policy:0,disablekb:1,enablejsapi:1,fs:0,modestbranding:1},events:{onReady:K,onStateChange:Q,onError:W}},t=document.querySelector("#current-video");t&&(e.videoId=t.getAttribute("value")),d=new YT.Player("player",e)}function K(e){e.target.setVolume(100),console.log("Initialized youtube player"),A()}function Q(e){e.data===YT.PlayerState.ENDED&&(console.log("Load next video"),s.emit("queueNext",{clubId:U.clubId}),T()),e.data===YT.PlayerState.PLAYING&&P()}function W(e){s.emit("queueNext",U.clubId),m(`Error loading video. code ${e.data}`),T()}var B=X;var Z=l(),s;function ee(){s=io(`/${Z.clubId}`),s.on("connect",()=>{console.log("Club socket connected"),B()})}var F=ee;var M=JSON.parse(localStorage.getItem("user")),y={headers:{"Content-Type":"application/json"},method:"POST"},x=async(e,t,o)=>{if(M){let{clubId:n,_id:i}=M;y.headers.Authorization=`${i} ${n}`}t&&(y.body=JSON.stringify(t)),o&&(y.method=o);let r=await fetch(N+e,y);if(r.status>=200&&r.status<=299){let n=await r.json();return Promise.resolve(n)}m(r.error)},g={signup:async e=>{let t=await x(`/signup/${e.url}`,e.body);return Promise.resolve(t)},search:async e=>{let t=await x("/search",e);return Promise.resolve(t)},addVideo:async e=>{let t=await x("/addVideo",e);return Promise.resolve(t)}};function te(e,t,o,r){e.addEventListener("click",async n=>{t&&(t.innerText="");let i={name:o,videoId:r};await g.addVideo(i)})}var h=te;function oe(){let t=document.querySelector(".main--history-list").getElementsByTagName("li");for(let o of t){let r=o.querySelector(".played-video").value,n=o.getElementsByTagName("button")[0],i=n.querySelector(".played-video--name").innerText;h(n,null,i,r)}}var _=oe;function re(e){let t=new DocumentFragment,o=document.createElement("ul");return o.className="main--result-list",e.items.forEach(r=>{let n=document.createElement("li"),i=document.createElement("button");i.className="btn--result",h(i,o,r.snippet.title,r.id.videoId);let a=document.createElement("span"),u=document.createTextNode(r.snippet.title);a.appendChild(u);let c=document.createElement("img");c.setAttribute("src",r.snippet.thumbnails.default.url),c.className="thumbnail",i.appendChild(a),i.appendChild(c),n.appendChild(i),o.appendChild(n)}),t.append(o),t}var D=re;async function ne(e){e.preventDefault();let t=I.formData(),o=await g.search(t),r=document.querySelector(".main--search-results");r.innerText="";let n=D(o.results);r.appendChild(n)}var R=ne;var I=new E;window.onload=()=>{let e=document.querySelector(".main--search");I.init(e),e.addEventListener("submit",R),_(),F()};})();
//# sourceMappingURL=index.js.map
