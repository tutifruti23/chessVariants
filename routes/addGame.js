var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('addGame', { title: 'Stajnia - strona główna' });
});



module.exports = router;