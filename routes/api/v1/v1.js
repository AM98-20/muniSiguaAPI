const router = require('express').Router();

//Routes
router.use('/auth', require('./auth/auth.route'));
router.use('/users', require('./users/users.route'));
router.use('/events', require('./contents/events.route'));
router.use('/news', require('./contents/news.route'));

module.exports = router;