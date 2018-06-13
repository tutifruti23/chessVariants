var express = require('express');
var router = express.Router();
var gamesController = require('../controllers/gamesController');

/* GET home page. */
router.get('/', function(req, res, next) {
    gamesController.findAllGames(function (data) {
        res.render('games', { title: 'Stajnia - gry', gamesList:data });
    });
});

router.get('/checkiflogged', function(req, res, next) {
    //TODO change to actual join room not game
    var token = req.cookies.token;
    if(token) {
        res.send(true);
    }else{
        res.send(false);
    }
});

module.exports = router