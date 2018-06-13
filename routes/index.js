var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var token = req.cookies.token;
  if(token){

  }
  res.render('index', { title: 'Stajnia - strona główna' });
});



module.exports = router;
