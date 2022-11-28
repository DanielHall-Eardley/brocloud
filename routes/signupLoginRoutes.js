const router = require("express").Router();
const controller = require("../controllers/signupLoginController");

router.get("/login", controller.getLogin);
router.get("/signup", controller.getSignup);
router.post("/login", controller.login);
router.post("/signup/join/:clubId", controller.joinClub);
router.post("/signup/create/:clubName", controller.createClub);

module.exports = router;
