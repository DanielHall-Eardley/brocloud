const router = require('express').Router()
const controller = require('../controllers/youtubeApiController');

router.post('/search', controller.search);

module.exports = router