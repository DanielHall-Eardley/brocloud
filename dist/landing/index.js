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
    window.location.replace(`${host}/music/${user._id}`);
  }
})();
//# sourceMappingURL=index.js.map
