var express = require('express');
var router = express.Router();
var loginController = require('../controllers/loginController');

var DAY_IN_MS = 86400000;

router.get('/', function(req, res, next) {
    if(req.session.userData){
        res.redirect('../room');
    }
    else{
        res.render('login', { title: 'Express' });
    }

});

router.post('/logindata', function(req, res) {
    loginController.validateDataLogin(req.body.email,req.body.password,function callback(token,data) {

        if(data != null) {
            data.isValid=true;
            req.session.userData=data;
            req.session.token = token;
            res.cookie('token', token, {
                maxAge: DAY_IN_MS,
                httpOnly: true,
                secure: (process.env.SECURE_COOKIES == 'true') //trick to swap string to bool
            });
            res.cookie('username', data.name, {
                maxAge: DAY_IN_MS,
                httpOnly: false,
                secure: (process.env.SECURE_COOKIES == 'true') //trick to swap string to bool
            });
            res.send(data);
        }else{
            res.send(false);
        }
    });
});

router.post('/register', function (req,res) {
    loginController.validateDataRegister(req.body,function callback(token,data) {
        /*if(token != null) {
            req.session.userData=data;
            req.session.token = token;
            res.cookie('token', token, {
                maxAge: DAY_IN_MS,
                httpOnly: true,
                secure: (process.env.SECURE_COOKIES == 'true') //trick to swap string to bool
            });
            res.cookie('username', data.name, {
                maxAge: DAY_IN_MS,
                httpOnly: false,
                secure: (process.env.SECURE_COOKIES == 'true') //trick to swap string to bool
            });

            res.send(true);
        }else{
            res.send(false);
        }*/
        res.send(data);
    });
});

router.post('/googleLogin', function( req, res){
    loginController.loginGoogle(req.body.idToken, function (token, data) {
        console.log("to data "+data);

        if(token != null) {
            req.session.userData=data;
            req.session.token = token;
            res.cookie('token', token, {
                maxAge: DAY_IN_MS,
                httpOnly: true,
                secure: (process.env.SECURE_COOKIES == 'true') //trick to swap string to bool
            });
            res.cookie('username', data.name, {
                maxAge: DAY_IN_MS,
                httpOnly: false,
                secure: (process.env.SECURE_COOKIES == 'true') //trick to swap string to bool
            });
            res.send(true);
        }else{
            res.send(false);
        }
    }).catch(console.error);
});


module.exports = router;