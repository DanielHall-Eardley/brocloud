(()=>{var e="https://bro-cloud.herokuapp.com";var r=t=>{window.location.replace(`${e}/music/${t.clubId}/${t._id}`)};window.onload=n;function n(){if(!JSON.parse(localStorage.getItem("userSignedUp")))return window.location.replace(`${e}/signup`);let o=JSON.parse(localStorage.getItem("user"));if(!o)return window.location.replace(`${e}/login`);r(o)}})();
//# sourceMappingURL=index.js.map
