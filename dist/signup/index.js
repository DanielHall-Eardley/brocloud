(()=>{var a="https://bro-cloud.herokuapp.com",c=class{constructor(){this.state={}}updateState(o){let e=o.target.name,r=o.target.value;this.state[e]=r}init(o){let e=o.children;for(let r of e)(r.nodeName==="INPUT"||r.nodeName==="SELECT")&&r.addEventListener("input",this.updateState.bind(this))}formData(){return this.state}},n={error:null,updateError(t){this.error=t},getError(){return this.error}};var i=async(t,o)=>{let e=await fetch(a+t,o);if(e.status>=200&&e.status<=299){let r=await e.json();return Promise.resolve(r)}n.updateError(e.error)},u=JSON.parse(localStorage.getItem("user"));u||n.updateError("Please login");var{clubId:m,_id:p}=u,s={headers:{"Content-Type":"application/json",Authorization:`${p} ${m}`},method:"POST"},d={signup:async t=>{s.body=JSON.stringify(t);let o=await i("/signup",s);return Promise.resolve(o)},search:async t=>{s.body=JSON.stringify(t);let o=await i("/search",s);return Promise.resolve(o)},addVideo:async t=>{s.body=JSON.stringify(t);let o=await i("/addVideo",s);return Promise.resolve(o)}};var l=new c;window.onload=()=>{console.log("f");let t=document.querySelector(".signup--form");l.init(t),t.addEventListener("submit",f)};async function f(t){t.preventDefault();let o=l.formData(),e=await d.signup(o);console.log(e),localStorage.setItem("user",JSON.stringify(e.user)),window.location.replace(`${a}/music/${e.user.clubId}`)}})();
//# sourceMappingURL=index.js.map
