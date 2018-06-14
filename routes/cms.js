var express = require('express');
var router = express.Router();
var cmsController = require('../controllers/cmsController');

/* GET home page. */
router.get('/', function(req, res) {
    var token = req.cookies.token;
    if(token){
        cmsController.findAllGames(token,function (acces,data) {
            if (acces){
                res.render('cms', { title: 'Stajnia - cms', gamesList:data });
            }else {
                res.send('log in as admin to get cms access');
            }
        })
    }else{
        res.send('log in as admin to get cms access');
    }
});

router.get('/getconfig', function(req, res) {
    var token = req.cookies.token;
    if(token){
        cmsController.getConfig(token,req.query.id,function (data) {
            res.send(JSON.stringify(data));
        });
    }else{
        res.send('log in as admin to get cms access');
    }
});

router.get('/deletegame', function(req, res) {
    var token = req.cookies.token;
    if(token){
        cmsController.deleteGame(token,req.query.id,function (result) {
            res.send(result);
        });
    }else{
        res.send('log in as admin to get cms access');
    }
});

router.post('/saveconfig',function (req,res) {
    var token = req.cookies.token;
    if(token) {
        cmsController.updateConfig(token,req.body,function (result) {
            res.send(result);
        })
    }else{
        res.send('log in as admin to get cms access');
    }
});

router.post('/addnewgame',function (req,res) {
    var token = req.cookies.token;
    if(token) {
        cmsController.addNewGame(token,req.body,function (result) {
            res.send(result);
        })
    }else{
        res.send('log in as admin to get cms access');
    }
});

router.post('/updategame',function (req,res) {
    var token = req.cookies.token;
    if(token) {
        cmsController.updateGame(token,req.body,function (result) {
            res.send(result);
        })
    }else{
        res.send('log in as admin to get cms access');
    }
});

router.post('/grantadmin',function (req,res) {
    var token = req.cookies.token;
    if(token) {
        cmsController.grantAdmin(token,req.body.email,function (result) {
            res.send(result);
        })
    }else{
        res.send('log in as admin to get cms access');
    }
});

router.post('/changegameactivity',function (req,res) {
    var token = req.cookies.token;
    if(token) {
        cmsController.changeActiveGame(token,req.body,function (result) {
            res.send(result);
        });
    }else{
        res.send('log in as admin to get cms access');
    }
});

router.post('/revokeadmin',function (req,res) {
    var token = req.cookies.token;
    if(token) {
        cmsController.revokeAdmin(token,req.body.email,function (result) {
            res.send(result);
        })
    }else{
        res.send('log in as admin to get cms access');
    }
});

module.exports = router;