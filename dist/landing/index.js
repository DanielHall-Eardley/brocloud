(()=>{var e="https://bro-cloud.herokuapp.com";window.onload=o;function o(){let t=JSON.parse(localStorage.getItem("user"));if(!t)return window.location.replace(`${e}/signup`);window.location.replace(`${e}/music/${t.clubId}/${t._id}`)}})();
//# sourceMappingURL=index.js.map
