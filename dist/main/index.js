(()=>{var ae=Object.create;var N=Object.defineProperty;var se=Object.getOwnPropertyDescriptor;var oe=Object.getOwnPropertyNames;var ne=Object.getPrototypeOf,ie=Object.prototype.hasOwnProperty;var de=e=>N(e,"__esModule",{value:!0});var fe=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var ue=(e,t,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of oe(t))!ie.call(e,a)&&a!=="default"&&N(e,a,{get:()=>t[a],enumerable:!(r=se(t,a))||r.enumerable});return e},le=e=>ue(de(N(e!=null?ae(ne(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var R=fe(U=>{function je(e,t){if(!t)return e;let r=Object.keys(t);return r.length>0&&r.forEach(a=>{let s=t[a];e.setAttribute(a,s)}),e}function ye(e,t){if(t){let r=document.createTextNode(t);e.appendChild(r)}return e}U.createHTMLComponent=function(e){let t=new DocumentFragment;function r(a,s){a.forEach(o=>{let{name:n,attributes:d,content:i,children:u}=o,m=document.createElement(n),p=je(m,d),F=ye(p,i);s.append(F),u&&u.length>0&&r(u,F)})}return r(e,t),t}});var Q="https://bro-cloud.herokuapp.com",P=class{constructor(t=null){this.state={},this.customFn=t}updateState(t,r){this.state[t]=r}eventListener(t){let r=t.target.name,a=t.target.value;this.updateState.apply(this,[r,a])}init(t){let r=t.children;for(let a of r)(a.nodeName==="INPUT"||a.nodeName==="SELECT")&&a.addEventListener("input",this.eventListener.bind(this))}formData(){return this.state}},c=e=>{let t=document.querySelector(".error"),r=document.createTextNode(e);t.appendChild(r),setTimeout(()=>{t.innerText=""},2e4)};function me(e){let t=e.video,r=document.querySelector(".main--up-next"),a=r.getElementsByTagName("li").length,s=document.createTextNode(t.name),o=document.createTextNode(t.userFullName),n=document.createElement("li");n.setAttribute("id",t._id);let d=document.createElement("div");d.className="main--name-highlight",d.appendChild(o);let i=document.createElement("input");i.setAttribute("type","hidden"),i.setAttribute("value",t.videoId),a===0?i.setAttribute("id","current-video"):i.setAttribute("class","next-video"),n.appendChild(i),n.appendChild(s),n.appendChild(d),r.appendChild(n),a===0&&l.loadVideoById(t.videoId)}var A=me;function xe(e){let r=document.querySelector(".main--squad-list").getElementsByTagName("li");for(let a of r){let s=a.getElementsByTagName("span");s[1].className="u--red-circle"}e.forEach(a=>{for(let s of r)if(s.id.toString()===a.toString()){let o=s.getElementsByTagName("span");o[1].className="u--green-circle"}})}var g=xe;var ce;function pe(e){ce=e,document.querySelector("#current-video")&&l.seekTo(e.ellapsedSeconds,!0),g(e.members)}var V=pe;var v=le(R());var _=JSON.parse(localStorage.getItem("user")),I={headers:{"Content-Type":"application/json"},method:"POST"},j=async(e,t,r)=>{if(_){let{clubId:o,_id:n}=_;I.headers.Authorization=`${n} ${o}`}t&&(I.body=JSON.stringify(t)),r&&(I.method=r);let a=await fetch(Q+e,I),s=await a.json();if(a.status>=200&&a.status<=299)return Promise.resolve(s);console.log(s),c(s.error)},S={signupJoin:async(e,t)=>{let r=await j(`/signup/join/${t}`,e);return Promise.resolve(r)},signupCreate:async(e,t)=>{let r=await j(`/signup/create/${t}`,e);return Promise.resolve(r)},search:async e=>{let t=await j("/youtube-api/search",e);return Promise.resolve(t)},addVideo:async e=>{let t=await j("/music/addVideo",e);return Promise.resolve(t)},login:async e=>{let t=await j("/login",e);return Promise.resolve(t)}};function he(e,t){let r=e.querySelector(".played-video").value,a=e.getElementsByTagName("button")[0],s=a.querySelector(".played-video--name").innerText;a.addEventListener("click",async o=>{t&&(t.innerText="");let n={name:s,videoId:r};await S.addVideo(n)})}var T=he;function ge(){let t=document.querySelector(".main--history-list").getElementsByTagName("li");for(let r of t)T(r,null)}var O=ge;function Ie(e){return[{name:"li",attributes:{id:e._id},content:e.name,children:[{name:"input",attributes:{type:"hidden",class:"next-video",value:e.videoId}},{name:"div",content:e.userFullName,attributes:{class:"main--name-highlight",value:e.videoId}}]}]}function Se(e){return[{name:"li",attributes:{id:e._id},content:e.name,children:[{name:"input",attributes:{type:"hidden",id:"current-video",value:e.videoId}},{name:"div",content:e.userFullName,attributes:{class:"main--name-highlight",value:e.videoId}}]}]}function Te(e){return[{name:"li",attributes:{id:e._id},children:[{name:"input",attributes:{type:"hidden",class:"played-video",value:e.videoId}},{name:"button",attributes:{class:"btn--result btn--history"},children:[{name:"p",attributes:{class:"played-video--name"},content:e.name},{name:"p",content:e.userFullName,children:[{name:"span",attributes:{class:"main--timestamp"},content:` | ${e.playedAtTime}`}]}]}]}]}function Oe(e){let{upNext:t,history:r}=e,a=e.upNext[0],s=document.querySelector(".main--up-next"),o=document.querySelector(".main--history-list");s.innerHTML="",o.innerHTML="",a&&(l.loadVideoById(a.videoId),t.forEach((n,d)=>{if(d===0){let i=(0,v.createHTMLComponent)(Se(n));s.append(i)}else{let i=(0,v.createHTMLComponent)(Ie(n));s.append(i)}})),r.forEach(n=>{let d=(0,v.createHTMLComponent)(Te(n));o.append(d)}),O()}var B=Oe;function ve(){let e=document.querySelector("#current-video");return e?e.getAttribute("value"):!1}var y=ve;function Y(e){if(e===null||e===!0||e===!1)return NaN;var t=Number(e);return isNaN(t)?t:t<0?Math.ceil(t):Math.floor(t)}function x(e,t){if(t.length<e)throw new TypeError(e+" argument"+(e>1?"s":"")+" required, but only "+t.length+" present")}function D(e){x(1,arguments);var t=Object.prototype.toString.call(e);return e instanceof Date||typeof e=="object"&&t==="[object Date]"?new Date(e.getTime()):typeof e=="number"||t==="[object Number]"?new Date(e):((typeof e=="string"||t==="[object String]")&&typeof console!="undefined"&&(console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"),console.warn(new Error().stack)),new Date(NaN))}var De=Math.pow(10,8)*24*60*60*1e3,C=6e4,w=36e5;var St=-De;function E(e,t){return x(2,arguments),D(e).getTime()-D(t).getTime()}var $={ceil:Math.ceil,round:Math.round,floor:Math.floor,trunc:function(e){return e<0?Math.ceil(e):Math.floor(e)}},Me="trunc";function z(e){return e?$[e]:$[Me]}function M(e,t,r){x(2,arguments);var a=E(e,t)/1e3;return z(r==null?void 0:r.roundingMethod)(a)}function b(e,t){x(1,arguments);var r=t||{},a=r.additionalDigits==null?2:Y(r.additionalDigits);if(a!==2&&a!==1&&a!==0)throw new RangeError("additionalDigits must be 0, 1 or 2");if(!(typeof e=="string"||Object.prototype.toString.call(e)==="[object String]"))return new Date(NaN);var s=Ne(e),o;if(s.date){var n=Ye(s.date,a);o=Ce(n.restDateString,n.year)}if(!o||isNaN(o.getTime()))return new Date(NaN);var d=o.getTime(),i=0,u;if(s.time&&(i=we(s.time),isNaN(i)))return new Date(NaN);if(s.timezone){if(u=Ee(s.timezone),isNaN(u))return new Date(NaN)}else{var m=new Date(d+i),p=new Date(0);return p.setFullYear(m.getUTCFullYear(),m.getUTCMonth(),m.getUTCDate()),p.setHours(m.getUTCHours(),m.getUTCMinutes(),m.getUTCSeconds(),m.getUTCMilliseconds()),p}return new Date(d+i+u)}var k={dateTimeDelimiter:/[T ]/,timeZoneDelimiter:/[Z ]/i,timezone:/([Z+-].*)$/},be=/^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/,ke=/^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/,We=/^([+-])(\d{2})(?::?(\d{2}))?$/;function Ne(e){var t={},r=e.split(k.dateTimeDelimiter),a;if(r.length>2)return t;if(/:/.test(r[0])?a=r[0]:(t.date=r[0],a=r[1],k.timeZoneDelimiter.test(t.date)&&(t.date=e.split(k.timeZoneDelimiter)[0],a=e.substr(t.date.length,e.length))),a){var s=k.timezone.exec(a);s?(t.time=a.replace(s[1],""),t.timezone=s[1]):t.time=a}return t}function Ye(e,t){var r=new RegExp("^(?:(\\d{4}|[+-]\\d{"+(4+t)+"})|(\\d{2}|[+-]\\d{"+(2+t)+"})$)"),a=e.match(r);if(!a)return{year:NaN,restDateString:""};var s=a[1]?parseInt(a[1]):null,o=a[2]?parseInt(a[2]):null;return{year:o===null?s:o*100,restDateString:e.slice((a[1]||a[2]).length)}}function Ce(e,t){if(t===null)return new Date(NaN);var r=e.match(be);if(!r)return new Date(NaN);var a=!!r[4],s=h(r[1]),o=h(r[2])-1,n=h(r[3]),d=h(r[4]),i=h(r[5])-1;if(a)return Qe(t,d,i)?He(t,d,i):new Date(NaN);var u=new Date(0);return!Le(t,o,n)||!Fe(t,s)?new Date(NaN):(u.setUTCFullYear(t,o,Math.max(s,n)),u)}function h(e){return e?parseInt(e):1}function we(e){var t=e.match(ke);if(!t)return NaN;var r=H(t[1]),a=H(t[2]),s=H(t[3]);return Pe(r,a,s)?r*w+a*C+s*1e3:NaN}function H(e){return e&&parseFloat(e.replace(",","."))||0}function Ee(e){if(e==="Z")return 0;var t=e.match(We);if(!t)return 0;var r=t[1]==="+"?-1:1,a=parseInt(t[2]),s=t[3]&&parseInt(t[3])||0;return Ae(a,s)?r*(a*w+s*C):NaN}function He(e,t,r){var a=new Date(0);a.setUTCFullYear(e,0,4);var s=a.getUTCDay()||7,o=(t-1)*7+r+1-s;return a.setUTCDate(a.getUTCDate()+o),a}var qe=[31,null,31,30,31,30,31,31,30,31,30,31];function J(e){return e%400==0||e%4==0&&e%100!=0}function Le(e,t,r){return t>=0&&t<=11&&r>=1&&r<=(qe[t]||(J(e)?29:28))}function Fe(e,t){return t>=1&&t<=(J(e)?366:365)}function Qe(e,t,r){return t>=1&&t<=53&&r>=0&&r<=6}function Pe(e,t,r){return e===24?t===0&&r===0:r>=0&&r<60&&t>=0&&t<60&&e>=0&&e<25}function Ae(e,t){return t>=0&&t<=59}function Z(){let e=y(),t={videoId:e,timestamp:new Date};e&&f.emit("startSync",t)}function G(e){let t=l.getCurrentTime(),r=new Date,a=b(e),s=M(r,a),o=s-t;console.log({sync:s,currentPosition:t}),(o>2||o<-2)&&l.seekTo(s,!0)}function Ve(){f.on("updateClubState",V),f.on("queueNext",B),f.on("memberLeft",g),f.on("addToPlaylist",A),f.on("syncTrack",G),console.log("Initialized socket listeners"),f.emit("setupClub")}var K=Ve;function Ue(){let e=JSON.parse(localStorage.getItem("user"));return e||c("No user logged in"),e}var W=Ue;var or=W(),l;function Re(){let e=y(),t={height:"300",width:"500",videoId:e,playerVars:{cc_load_policy:0,controls:0,disablekb:1,enablejsapi:1,fs:0,modestbranding:1,autoplay:1},events:{onReady:_e,onStateChange:Be,onError:$e}};l=new YT.Player("player",t)}function _e(e){e.target.setVolume(100),console.log("Initialized youtube player"),K()}function Be(e){if(e.data===YT.PlayerState.ENDED){console.log("Load next video");let t=y();f.emit("queueNext",{videoId:t})}e.data===YT.PlayerState.PLAYING&&Z()}function $e(e){f.emit("queueNext"),c(`Error loading video. code ${e.data}`)}var X=Re;var q=W(),f;function ze(){f=io(`/${q.clubId}`,{query:{userId:q._id,clubId:q.clubId}}),f.on("connect",()=>{console.log("Club socket connected"),X()})}var ee=ze;function Je(e){let t=new DocumentFragment,r=document.createElement("ul");return r.className="main--result-list",e.items.forEach(a=>{let s=document.createElement("li"),o=document.createElement("button");o.className="btn--result",T(o,r,a.snippet.title,a.id.videoId);let n=document.createElement("span"),d=document.createTextNode(a.snippet.title);n.appendChild(d);let i=document.createElement("img");i.setAttribute("src",a.snippet.thumbnails.default.url),i.className="thumbnail",o.appendChild(n),o.appendChild(i),s.appendChild(o),r.appendChild(s)}),t.append(r),t}var te=Je;async function Ze(e){e.preventDefault();let t=L.formData(),r=await S.search(t),a=document.querySelector(".main--search-results");a.innerText="";let s=te(r.results);a.appendChild(s)}var re=Ze;var L=new P;window.onload=()=>{let e=document.querySelector(".main--search");L.init(e),e.addEventListener("submit",re),O(),ee()};})();
//# sourceMappingURL=index.js.map
