(()=>{var h="https://bro-cloud.herokuapp.com",l=class{constructor(t=null){this.state={},this.customFn=t}updateState(t,e){this.state[t]=e}eventListener(t){let e=t.target.name,o=t.target.value,n=t.target.innerText;this.updateState.apply(this,[e,o]),this.customFn&&this.customFn({key:e,value:o,innerText:n},this.state)}init(t,e){let o=t.children;for(let n of o)(n.nodeName==="INPUT"||n.nodeName==="SELECT")&&n.addEventListener("input",this.eventListener.bind(this));if(e){let{identifier:n,childElementType:s,eventType:i}=e,a=document.querySelector(n).getElementsByTagName(s);for(let c of a)c.addEventListener(i,this.eventListener.bind(this))}}formData(){return this.state}},m=r=>{let t=document.querySelector(".error"),e=document.createTextNode(r);t.appendChild(e),setTimeout(()=>{t.innerText=""},2e4)};})();
//# sourceMappingURL=global.js.map
