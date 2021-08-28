const router = require('express').Router()
const controller = require('../controllers/musicController');

router.get('/:clubId/:userId', controller.getMusic);
router.post('/addVideo', controller.addVideo);

module.exports = router