const router = require("express").Router();
const controller = require("../controllers/signupLoginController");

router.get("/login", controller.getLogin);
router.post("/login", controller.login);

module.exports = router;
