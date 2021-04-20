const router = require('express').Router()
const controller = require('./controller');

router.get('/signup', controller.getSignup);
router.post('/signup', controller.signup)
router.get('/music/:clubId', controller.getMusic);
router.post('/search', controller.search)

module.exports = router