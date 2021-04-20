(() => {
  // static/common/global.js
  var host = "http://localhost:3000";

  // static/landing/index.js
  window.onload = checkForUser;
  function checkForUser() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      return window.location.replace(`${host}/signup`);
    }
    window.location.replace(`${host}/music/${user.clubId}`);
  }
})();
//# sourceMappingURL=index.js.map
