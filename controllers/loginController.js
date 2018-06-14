var loginModel = require('../models/loginModel');
var validateEmail = require('../modules/validateEmail');
var validatePassword=require("../modules/validatePassword");
var jwt = require('jsonwebtoken');

const CLIENT_ID = '1075415009326-ud16atsu14tjommm5t7q1vaa2lpgef8p.apps.googleusercontent.com';

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);



const PASSWORD_LENGTH = 6;

exports.validateDataLogin = function(email,password,validateDataHandler){
    if(validateEmail.validateEmail(email) && password.length>=PASSWORD_LENGTH) {
        loginModel.validateDataLogin(email, password, function callback(result, data) {
            if(result==true) {
                validateDataHandler(true, data)
            }else{
                validateDataHandler(null,null);
            }

        });
    }
};


exports.validateDataRegister = function(data,validateDataHandler) {

    if(validatePassword.isValidPassword(data.password)){
        loginModel.validateDataRegister(data.displayName, data.email, data.password,false, function callback(result, data) {
            if(result==true) {
                data.isValid=true;
                validateDataHandler(true, data)

            }else{
                validateDataHandler(false,null);
            }
        });
    }else  validateDataHandler(false, null);
};

exports.loginGoogle = async function(token, callback){
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    const name = payload['name'];
    const email = payload['email'];
    let data = {
      id:userid,
      name:name,
      email:email,
    };
    loginModel.validateDataRegister(data.name,data.email,' ',true, function (result,data) {
        jwt.sign({
                id: userid,
                name: name,
                admin: false
            },
            process.env.SECRET, {
                expiresIn: 86400 // expires in 24 hours
            }, function (err, token) {
                if (err) {
                    console.log(err);
                }
                callback(token, data)
            });
    });
};