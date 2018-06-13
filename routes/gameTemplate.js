var express = require('express');
var router = express.Router();
var redisController=require("../controllers/redisController");
/* GET home page. */
router.get('/', function(req, res, next) {

    redisController.getMapValue(req.query.id,'idGame',function(idGame){
        redisController.getMapValue(req.query.id,'numberOfPlayers',function(numberOfPlayers){
            res.render('game', { title: 'Gra ....',idTable:req.query.id, name:req.session.userData.name,userId:req.session.userData.id,idGame:idGame,numberOfPlayers:numberOfPlayers});
        });
    });
});


module.exports = router;
