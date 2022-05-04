(()=>{var t="http://localhost:3000";window.onload=r;function r(){let e=JSON.parse(localStorage.getItem("user")),o=JSON.parse(localStorage.getItem("userSignedUp"));if(!e&&!o)return window.location.replace(`${t}/signup`);if(!e)return window.location.replace(`${t}/login`);window.location.replace(`${t}/music/${e.clubId}/${e._id}`)}})();
//# sourceMappingURL=index.js.map
