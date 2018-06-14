var express = require('express');
var router = express.Router();
var gamesController = require('../controllers/gamesController');
var layoutController=require('../controllers/layoutController');
var jwtDecode = require('../modules/jwtDecode');
/* GET home page. */
router.get('/', function(req, res, next) {

     if(req.session.userData){
       gamesController.findAllGames(function (data) {
             res.render('room', { title: 'Stajnia - gry', gamesList:data, name:req.session.userData.name,userId:req.session.userData.id});
        });
     }
     else{
        res.redirect('../login');
     }
    /*let token = req.cookies.token;
    if(token){
        jwtDecode.decode(token,function (decoded){
            console.log('beforexd')
            res.render('room', { title: 'Stajnia - gry', name:decoded.name, userId:decoded.id});
        });
    } else {
        res.redirect('../login');
    }*/
});

router.get('/newGame',function(req,res){
    res.send(layoutController.getTicTacToeLayout());
});





module.exports = router