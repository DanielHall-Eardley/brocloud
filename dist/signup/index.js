(()=>{var F=Object.create;var c=Object.defineProperty;var O=Object.getOwnPropertyDescriptor;var U=Object.getOwnPropertyNames;var k=Object.getPrototypeOf,D=Object.prototype.hasOwnProperty;var H=t=>c(t,"__esModule",{value:!0});var g=(t,e)=>()=>(t&&(e=t(t=0)),e);var i=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var V=(t,e,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of U(e))!D.call(t,o)&&o!=="default"&&c(t,o,{get:()=>e[o],enumerable:!(n=O(e,o))||n.enumerable});return t},s=t=>V(H(c(t!=null?F(k(t)):{},"default",t&&t.__esModule&&"default"in t?{get:()=>t.default,enumerable:!0}:{value:t,enumerable:!0})),t);var d,b,f,S,h,m=g(()=>{d="https://bro-cloud.herokuapp.com",b=class{constructor(e=null){this.state={},this.customFn=e}updateState(e,n){this.state[e]=n}eventListener(e){let n=e.target.name,o=e.target.value;this.updateState.apply(this,[n,o])}init(e){let n=e.children;for(let o of n)(o.nodeName==="INPUT"||o.nodeName==="SELECT")&&o.addEventListener("input",this.eventListener.bind(this))}formData(){return this.state}},f=t=>{let e=document.querySelector(".error"),n=document.createTextNode(t);e.appendChild(n),setTimeout(()=>{e.innerText=""},2e4)},S=t=>{localStorage.setItem("user",JSON.stringify(t)),localStorage.setItem("userSignedUp",!0)},h=t=>{window.location.replace(`${d}/music/${t.clubId}/${t._id}`)}});var l=i(y=>{y.updateSignupBtn=(t,e,n=null)=>{let o=document.querySelector("#signup-submit--btn");o.innerText="",o.appendChild(t),n&&(o.dataset.clubId=n),o.dataset.clubName=e}});var N=i(L=>{var C=s(l());L.joinClubListener=function(){document.querySelector(".signup-join--club").addEventListener("click",e=>{let n=e.target.id,o=e.target.innerText,r=document.createTextNode(`Join ${o} Club`);(0,C.updateSignupBtn)(r,o,n)})}});var x=i(v=>{var w=s(l());v.createClubListener=function(){document.querySelector(".signup-create--club").addEventListener("input",e=>{let n=e.target.value,o=document.createTextNode(`Create ${n} Club`);(0,w.updateSignupBtn)(o,n)})}});var T,u,a,p,I=g(()=>{m();T=JSON.parse(localStorage.getItem("user")),u={headers:{"Content-Type":"application/json"},method:"POST"},a=async(t,e,n)=>{if(T){let{clubId:r,_id:J}=T;u.headers.Authorization=`${J} ${r}`}e&&(u.body=JSON.stringify(e)),n&&(u.method=n);let o=await fetch(d+t,u);if(o.status>=200&&o.status<=299){let r=await o.json();return Promise.resolve(r)}f(o.error)},p={signupJoin:async(t,e)=>{let n=await a(`/signup/join/${e}`,t);return Promise.resolve(n)},signupCreate:async(t,e)=>{let n=await a(`/signup/create/${e}`,t);return Promise.resolve(n)},search:async t=>{let e=await a("/youtube-api/search",t);return Promise.resolve(e)},addVideo:async t=>{let e=await a("/music/addVideo",t);return Promise.resolve(e)},login:async t=>{let e=await a("/login",t);return Promise.resolve(e)}}});var $=i(E=>{I();E.submitSignup=async t=>{let e=document.querySelector("#signup-submit--btn"),n=e.dataset.clubId;if(n)return p.signupJoin(t,n);let o=e.dataset.clubName;return p.signupCreate(t,o)}});m();var j=s(N()),B=s(x()),P=s($()),q=new b;window.onload=()=>{let t=document.getElementsByTagName("form")[0];q.init(t),t.addEventListener("submit",_),(0,j.joinClubListener)(),(0,B.createClubListener)()};async function _(t){t.preventDefault();let e=q.formData(),{user:n}=await(0,P.submitSignup)(e);S(n),h(n)}})();
//# sourceMappingURL=index.js.map
