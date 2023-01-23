const router = require("express").Router();
const controller = require("../controllers/signupLoginController");

router.get("/", controller.getSignup);
router.post("/join", controller.joinClub);
router.post("/create", controller.createClub);

module.exports = router;
