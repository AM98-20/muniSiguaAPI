var express = require('express');
var router = express.Router();

router.use('/api', require('./api/api'));

/*router.get('/main', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    res.status(200).json({'version':'1.0', 'application':'munisigua backend'});
  });*/

module.exports = router;