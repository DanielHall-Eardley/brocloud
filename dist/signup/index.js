(()=>{var O=Object.create;var c=Object.defineProperty;var D=Object.getOwnPropertyDescriptor;var U=Object.getOwnPropertyNames;var k=Object.getPrototypeOf,H=Object.prototype.hasOwnProperty;var V=t=>c(t,"__esModule",{value:!0});var g=(t,e)=>()=>(t&&(e=t(t=0)),e);var i=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var _=(t,e,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of U(e))!H.call(t,o)&&o!=="default"&&c(t,o,{get:()=>e[o],enumerable:!(n=D(e,o))||n.enumerable});return t},r=t=>_(V(c(t!=null?O(k(t)):{},"default",t&&t.__esModule&&"default"in t?{get:()=>t.default,enumerable:!0}:{value:t,enumerable:!0})),t);var d,b,f,S,h,m=g(()=>{d="https://brocloud.ca",b=class{constructor(e=null){this.state={},this.customFn=e}updateState(e,n){this.state[e]=n}eventListener(e){let n=e.target.name,o=e.target.value;this.updateState.apply(this,[n,o])}init(e){let n=e.children;for(let o of n)(o.nodeName==="INPUT"||o.nodeName==="SELECT")&&o.addEventListener("input",this.eventListener.bind(this))}formData(){return this.state}},f=t=>{let e=document.querySelector(".error"),n=document.createTextNode(t);e.appendChild(n),setTimeout(()=>{e.innerText=""},2e4)},S=t=>{localStorage.setItem("user",JSON.stringify(t))},h=t=>{window.location.replace(`${d}/music/${t.clubId}/${t._id}`)}});var l=i(y=>{y.updateSignupBtn=(t,e,n=null)=>{let o=document.querySelector("#signup-submit--btn");o.innerText="",o.appendChild(t),n&&(o.dataset.clubId=n),o.dataset.clubName=e}});var N=i(L=>{var C=r(l());L.joinClubListener=function(){document.querySelector(".signup-join--club").addEventListener("click",e=>{let n=e.target.id,o=e.target.innerText,a=document.createTextNode(`Join ${o} Club`);(0,C.updateSignupBtn)(a,o,n)})}});var x=i(v=>{var w=r(l());v.createClubListener=function(){document.querySelector(".signup-create--club").addEventListener("input",e=>{let n=e.target.value,o=document.createTextNode(`Create ${n} Club`);(0,w.updateSignupBtn)(o,n)})}});var T,u,s,p,I=g(()=>{m();T=JSON.parse(localStorage.getItem("user")),u={headers:{"Content-Type":"application/json"},method:"POST"},s=async(t,e,n)=>{if(T){let{clubId:J,_id:F}=T;u.headers.Authorization=`${F} ${J}`}e&&(u.body=JSON.stringify(e)),n&&(u.method=n);let o=await fetch(d+t,u),a=await o.json();if(o.status>=200&&o.status<=299)return Promise.resolve(a);f(a.error)},p={signupJoin:async(t,e)=>{let n=await s(`/signup/join/${e}`,t);return Promise.resolve(n)},signupCreate:async(t,e)=>{let n=await s(`/signup/create/${e}`,t);return Promise.resolve(n)},search:async t=>{let e=await s("/youtube-api/search",t);return Promise.resolve(e)},addVideo:async t=>{let e=await s("/music/addVideo",t);return Promise.resolve(e)},login:async t=>{let e=await s("/login",t);return Promise.resolve(e)}}});var $=i(E=>{I();E.submitSignup=async t=>{let e=document.querySelector("#signup-submit--btn"),n=e.dataset.clubId;if(n)return p.signupJoin(t,n);let o=e.dataset.clubName;return p.signupCreate(t,o)}});m();var j=r(N()),B=r(x()),P=r($()),q=new b;window.onload=()=>{let t=document.getElementsByTagName("form")[0];q.init(t),t.addEventListener("submit",z),(0,j.joinClubListener)(),(0,B.createClubListener)()};async function z(t){t.preventDefault();let e=q.formData(),{user:n}=await(0,P.submitSignup)(e);S(n),h(n)}})();
//# sourceMappingURL=index.js.map
