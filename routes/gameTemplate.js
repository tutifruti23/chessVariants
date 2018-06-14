var express = require('express');
var router = express.Router();
var redisController=require("../controllers/redisController");
var gameData=require("../models/gameData");
/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.userData){
        redisController.getMapValue(req.query.id,'idGame',function(idGame){
            redisController.getMapValue(req.query.id,'numberOfPlayers',function(numberOfPlayers){

                    gameData.gameConfig(idGame, function (config) {
                        console.log(config);
                        console.log(config.config.script);
                        var jsFile=config.config.script;
                        res.render('game', {
                            title: 'Gra ....',
                            idTable: req.query.id,
                            name: req.session.userData.name,
                            userId: req.session.userData.id,
                            idGame: idGame,
                            numberOfPlayers: numberOfPlayers,
                            script:jsFile
                        });
                    });
            });
        });
    }
    else{
        res.redirect('../login');
    }

});


module.exports = router;
