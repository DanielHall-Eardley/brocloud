(()=>{var t="http://localhost:3000";window.onload=o;function o(){let e=JSON.parse(localStorage.getItem("user")),n=JSON.parse(localStorage.getItem("userSignedUp"));if(!e&&!n)return window.location.replace(`${t}/signup`);if(!e)return window.location.replace(`${t}/login`);window.location.replace(`${t}/music/${e.clubId}/${e._id}`)}})();
//# sourceMappingURL=index.js.map
