const router = require("express").Router();
const controller = require("../controllers/musicController");

router.get("/:clubId/:userId", controller.getClub);
router.post("/playlist", controller.getPlaylist);
router.post("/addVideo", controller.addVideo);

module.exports = router;
