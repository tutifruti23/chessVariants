var express = require('express');

var router = express.Router();

var userController = require('../controllers/userController');

var validateEmail = require('../modules/validateEmail');
var validatePassword=require("../modules/validatePassword");

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.userData){
        userController.getUser(req.session.userData.id, function (data) {
            res.render('user', { title: 'Stajnia - Profil użytkownika', users:data });
        });
    }
    else{
        res.redirect('../login');
    }
});

router.post('/', function (req, res) {
    if(req.session.userData){
        nick = req.body.nick.replace(/\s/g, '');
        mail = req.body.mail.replace(/\s/g, '');
        if(!validateEmail.validateEmail(mail)){
            res.redirect('../user');
        }

        pass = req.body.pass.replace(/\s/g, '');
        if(!validatePassword.isValidPassword(pass)){
            res.redirect('../user');
        }

        userController.updateUser(req.session.userData.id, nick, mail, pass, function(result) {


            res.redirect('../user');
        })
    }
    else{
        res.redirect('../login');
    }
})
module.exports = router
