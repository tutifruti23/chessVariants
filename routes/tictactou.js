var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('tictactou', { title: 'Stajnia - gry' });
});


router.get('newGame',function(req,res){
    console.log("ciul");


});
router.get('/newGame',function(req,res){
    console.log("ciul");


});
module.exports = router