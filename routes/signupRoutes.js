const router = require("express").Router();
const controller = require("../controllers/signupLoginController");

router.get("/", controller.getSignup);
router.post("/join/:clubId", controller.joinClub);
router.post("/create/:clubName", controller.createClub);

module.exports = router;
