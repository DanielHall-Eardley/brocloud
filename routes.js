const router = require('express').Router()
const controller = require('./controller');

router.get('/signup', controller.getSignup);
router.post('/signup/join', controller.joinClub)
router.post('/signup/create', controller.createClub)
router.get('/music/:clubId/:userId', controller.getMusic);
router.post('/search', controller.search);
router.post('/addVideo', controller.addVideo);

module.exports = router