(()=>{var t="http://localhost:3000";var o=e=>{window.location.replace(`${t}/music/${e.clubId}/${e._id}`)};window.onload=n;function n(){let e=JSON.parse(localStorage.getItem("user")),r=JSON.parse(localStorage.getItem("userSignedUp"));if(!e&&!r)return window.location.replace(`${t}/signup`);if(!e)return window.location.replace(`${t}/login`);o(e)}})();
//# sourceMappingURL=index.js.map
