(()=>{var h="http://localhost:3000",l=class{constructor(t=null){this.state={},this.customFn=t}updateState(t,e){this.state[t]=e}eventListener(t){let e=t.target.name,s=t.target.value,n=t.target.innerText;this.updateState.apply(this,[e,s]),this.customFn&&this.customFn({key:e,value:s,innerText:n},this.state)}init(t,e){let s=t.children;for(let n of s)(n.nodeName==="INPUT"||n.nodeName==="SELECT")&&n.addEventListener("input",this.eventListener.bind(this));if(e){let{identifier:n,childElementType:r,eventType:i}=e,a=document.querySelector(n).getElementsByTagName(r);for(let c of a)c.addEventListener(i,this.eventListener.bind(this))}}formData(){return this.state}},u=o=>{let t=document.querySelector(".error"),e=document.createTextNode(o);t.appendChild(e),setTimeout(()=>{t.innerText=""},2e4)};})();
//# sourceMappingURL=global.js.map