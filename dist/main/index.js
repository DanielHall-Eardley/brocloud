(()=>{var h="https://bro-cloud.herokuapp.com",v=class{constructor(){this.state={}}updateState(e){let n=e.target.name,o=e.target.value;this.state[n]=o}init(e){let n=e.children;for(let o of n)(o.nodeName==="INPUT"||o.nodeName==="SELECT")&&o.addEventListener("input",this.updateState.bind(this))}formData(){return this.state}},p={error:null,updateError(t){this.error=t},getError(){return this.error}};var N=async(t,e)=>{let n=await fetch(h+t,e);if(n.status>=200&&n.status<=299){let o=await n.json();return Promise.resolve(o)}p.updateError(n.error)},T=JSON.parse(localStorage.getItem("user"));T||p.updateError("Please login");var{clubId:q,_id:V}=T,m={headers:{"Content-Type":"application/json",Authorization:`${V} ${q}`},method:"POST"},f={signup:async t=>{m.body=JSON.stringify(t);let e=await N("/signup",m);return Promise.resolve(e)},search:async t=>{m.body=JSON.stringify(t);let e=await N("/search",m);return Promise.resolve(e)},addVideo:async t=>{m.body=JSON.stringify(t);let e=await N("/addVideo",m);return Promise.resolve(e)}};var x=new v,b,S,d,u=JSON.parse(localStorage.getItem("user"));window.onload=()=>{let t=document.querySelector(".main--search");x.init(t),t.addEventListener("submit",L),F(),S=io(h),S.on("connect",()=>{console.log("Socket connected"),S.emit("setUpNs",u.clubId)}),d=io(`/${u.clubId}`),d.on("connect",()=>{console.log("Club NS socket connected"),B(),k()})};function B(){d.emit("setUpClub",u._id)}function k(){d.on("updatePlaylist",D),d.on("updateClubState",A)}function A(t){let e=u._id,n=u.clubId,o=document.querySelector("#videoId");if(!o){d.emit("playNext",n);return}j(o.value,t.ellapsedSeconds),O(t.members),e===t.members[0]&&setInterval(()=>{let a={seconds:b.getCurrentTime(),clubId:n};d.emit("updateSeconds",a)},1e3)}function F(){let e=document.querySelector(".main--history-list").getElementsByTagName("li");for(let n of e){let o=n.getAttribute("id"),a=n.getElementsByTagName("button")[0],r=a.getElementsByTagName("p")[0].innerText;I(a,null,r,o)}}function O(t){let n=document.querySelector(".main--squad-list").getElementsByTagName("li");t.forEach(o=>{for(let a of n)if(a.id.toString()===o.toString()){let r=a.getElementsByTagName("span");r[1].className="u--green-circle"}})}function j(t,e){b=new YT.Player("player",{height:"300",width:"500",videoId:t,playerVars:{cc_load_policy:0,autoplay:1,controls:0,disablekb:1,enablejsapi:1,fs:0,modestbranding:1,start:e},events:{onStateChange:J,onError:U}})}async function L(t){t.preventDefault();let e=x.formData(),n=await f.search(e),o=document.querySelector(".main--search-results");o.innerText="";let a=_(n.results);o.appendChild(a)}function I(t,e,n,o){t.addEventListener("click",async a=>{console.log(o,n),e&&(e.innerText="");let r={name:n,videoId:o},i=await f.addVideo(r);$(i)})}function _(t){let e=new DocumentFragment,n=document.createElement("ul");return n.className="main--result-list",t.items.forEach(o=>{let a=document.createElement("li"),r=document.createElement("button");r.className="btn--result",I(r,n,o.snippet.title,o.id.videoId);let i=document.createElement("span"),c=document.createTextNode(o.snippet.title);i.appendChild(c);let s=document.createElement("img");s.setAttribute("src",o.snippet.thumbnails.default.url),s.className="thumbnail",r.appendChild(i),r.appendChild(s),a.appendChild(r),n.appendChild(a)}),e.append(n),e}function $(t){let{currentlyPlaying:e,newVideo:n}=t;if(!n&&e.videoId){let o=document.querySelector(".main--playing"),a=o.getElementsByTagName("li")[0],r=document.createTextNode(e.name),i=document.createTextNode(e.userFullName),c=document.createElement("li"),s=document.createElement("div"),l=document.createElement("input");l.setAttribute("value",e.videoId),l.setAttribute("id","videoId"),l.setAttribute("type","hidden"),s.className="main--name-highlight",s.appendChild(i),c.appendChild(r),c.appendChild(s),c.appendChild(l),o.replaceChild(c,a)}if(n){let o=document.querySelector(".main--up-next"),a=document.createTextNode(n.name),r=document.createTextNode(n.userFullName),i=document.createElement("li"),c=document.createElement("div");c.className="main--name-highlight",c.appendChild(r),i.appendChild(a),i.appendChild(c),o.appendChild(i)}}function D(t){let{currentlyPlaying:e,playlist:n,seconds:o}=t,a=document.querySelector(".main--playing"),r=a.getElementsByTagName("li")[0],i=document.createTextNode(e.name),c=document.createTextNode(e.userFullName),s=document.createElement("li"),l=document.createElement("div");l.className="main--name-highlight",l.appendChild(c),s.appendChild(i),s.appendChild(l),a.replaceChild(s,r),b.loadVideoById(e.videoId,o);let E=document.querySelector(".main--up-next");E.innerText="",n.forEach(C=>{let P=document.createTextNode(C.name),w=document.createTextNode(C.userFullName),y=document.createElement("li"),g=document.createElement("div");g.className="main--name-highlight",g.appendChild(w),y.appendChild(P),y.appendChild(g),E.appendChild(y)})}async function J(t){let n=document.querySelector(".main--up-next").getElementsByTagName("li").length;t.data===YT.PlayerState.ENDED&&n>0&&d.emit("playNext",u.clubId)}function U(t){p.updateError(`Error loading video. code ${t.data}`),d.emit("playNext",u.clubId)}})();
//# sourceMappingURL=index.js.map
