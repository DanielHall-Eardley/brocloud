(()=>{var e="http://localhost:3000";window.onload=n;function n(){let t=JSON.parse(localStorage.getItem("user"));if(!t)return window.location.replace(`${e}/signup`);window.location.replace(`${e}/music/${t.clubId}/${t._id}`)}})();
//# sourceMappingURL=index.js.map
