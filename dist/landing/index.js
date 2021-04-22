(()=>{var t="http://localhost:3000";window.onload=o;function o(){let e=JSON.parse(localStorage.getItem("user"));if(!e)return window.location.replace(`${t}/signup`);window.location.replace(`${t}/music/${e.clubId}`)}})();
//# sourceMappingURL=index.js.map
