(()=>{var q=Object.create;var m=Object.defineProperty;var J=Object.getOwnPropertyDescriptor;var F=Object.getOwnPropertyNames;var O=Object.getPrototypeOf,U=Object.prototype.hasOwnProperty;var D=e=>m(e,"__esModule",{value:!0});var b=(e,t)=>()=>(e&&(t=e(e=0)),t);var a=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var k=(e,t,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of F(t))!U.call(e,o)&&o!=="default"&&m(e,o,{get:()=>t[o],enumerable:!(n=J(t,o))||n.enumerable});return e},s=e=>k(D(m(e!=null?q(O(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var i,g,f,d=b(()=>{i="http://localhost:3000",g=class{constructor(t=null){this.state={},this.customFn=t}updateState(t,n){this.state[t]=n}eventListener(t){let n=t.target.name,o=t.target.value;this.updateState.apply(this,[n,o])}init(t){let n=t.children;for(let o of n)(o.nodeName==="INPUT"||o.nodeName==="SELECT")&&o.addEventListener("input",this.eventListener.bind(this))}formData(){return this.state}},f=e=>{let t=document.querySelector(".error"),n=document.createTextNode(e);t.appendChild(n),setTimeout(()=>{t.innerText=""},2e4)}});var l=a(S=>{S.updateSignupBtn=(e,t,n=null)=>{let o=document.querySelector("#signup-submit--btn");o.innerText="",o.appendChild(e),n&&(o.dataset.clubId=n),o.dataset.clubName=t}});var C=a(y=>{var h=s(l());y.joinClubListener=function(){document.querySelector(".signup-join--club").addEventListener("click",t=>{let n=t.target.id,o=t.target.innerText,r=document.createTextNode(`Join ${o} Club`);(0,h.updateSignupBtn)(r,o,n)})}});var w=a(L=>{var N=s(l());L.createClubListener=function(){document.querySelector(".signup-create--club").addEventListener("input",t=>{let n=t.target.value,o=document.createTextNode(`Create ${n} Club`);(0,N.updateSignupBtn)(o,n)})}});var v,u,c,p,x=b(()=>{d();v=JSON.parse(localStorage.getItem("user")),u={headers:{"Content-Type":"application/json"},method:"POST"},c=async(e,t,n)=>{if(v){let{clubId:r,_id:P}=v;u.headers.Authorization=`${P} ${r}`}t&&(u.body=JSON.stringify(t)),n&&(u.method=n);let o=await fetch(i+e,u);if(o.status>=200&&o.status<=299){let r=await o.json();return Promise.resolve(r)}f(o.error)},p={signupJoin:async(e,t)=>{let n=await c(`/signup/join/${t}`,e);return Promise.resolve(n)},signupCreate:async(e,t)=>{let n=await c(`/signup/create/${t}`,e);return Promise.resolve(n)},search:async e=>{let t=await c("/youtube-api/search",e);return Promise.resolve(t)},addVideo:async e=>{let t=await c("/music/addVideo",e);return Promise.resolve(t)}}});var I=a(T=>{x();T.submitSignup=async e=>{let t=document.querySelector("#signup-submit--btn"),n=t.dataset.clubId;if(n)return p.signupJoin(e,n);let o=t.dataset.clubName;return p.signupCreate(e,o)}});d();var E=s(C()),$=s(w()),j=s(I()),B=new g;window.onload=()=>{let e=document.getElementsByTagName("form")[0];B.init(e),e.addEventListener("submit",V),(0,E.joinClubListener)(),(0,$.createClubListener)()};async function V(e){e.preventDefault();let t=B.formData(),n=await(0,j.submitSignup)(t);localStorage.setItem("user",JSON.stringify(n.user)),localStorage.setItem("userSignedUp",!0),window.location.replace(`${i}/music/${n.user.clubId}/${n.user._id}`)}})();
//# sourceMappingURL=index.js.map
