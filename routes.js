const router = require('express').Router()
const controller = require('./controller');

router.get('/signup', controller.getSignup);
router.post('/signup', controller.signup)
router.get('/music/:userId', controller.getMusic);

module.exports = router