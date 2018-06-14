var jwt = require('jsonwebtoken');
var cmsModel = require('../models/cmsModel');
var validateJSON = require('../modules/validateJSON');

handleCmsConnection = function (token, callback) {
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if(err){
            console.log(err);
        }
        if(decoded.admin){
            callback(null,true);
        }else{
            callback(null,false);
        }

    });
};

exports.findAllGames = function (token, callback) {
    handleCmsConnection(token,function (err, acces) {
        if(err){
            console.send(err);
        }else if (acces){
            cmsModel.findAllGames(function (data) {
               callback(true,data);
            });
        }else {
            callback(false,null);
        }
    })
};

exports.getConfig = function (token,configId, callback) {
    handleCmsConnection(token,function (err, acces) {
        if(err){
            console.send(err);
        }else if (acces){
            cmsModel.getConfig(configId,function (configData) {
                cmsModel.getGameDetails(configId,function (gamesDetailData) {
                    let returnObject = {
                        config:configData[0][0],
                        name:gamesDetailData[0][0],
                        description:gamesDetailData[0][1],
                        active:gamesDetailData[0][2],
                    };
                    callback(returnObject);
                })
            });
        }else {
            callback(null);
        }
    })
};

exports.updateConfig = function (token,data, callback) {
    handleCmsConnection(token,function (err, acces) {
        if(err){
            console.send(err);
        }else if (acces){
            if(validateJSON.isValidJSON(data.config)) {
                cmsModel.updateConfig(data.id, data.config, function (data) {
                    callback(data);
                });
            }else{
                callback(false);
            }
        }else {
            callback(null);
        }
    })
};

exports.changeActiveGame = function (token,data, callback) {
    handleCmsConnection(token,function (err, acces) {
        console.log('xd');
        if(err){
            console.send(err);
        }else if (acces){
            cmsModel.changeActiveGame(data.id, data.active,function (data) {
                callback(data);
            });
        }else {
            callback(null);
        }
    })
};

exports.deleteGame = function (token,id, callback) {
    handleCmsConnection(token,function (err, acces) {
        if(err){
            console.send(err);
        }else if (acces){
            cmsModel.deleteGame(id,function (data) {
                callback(data);
            });
        }else {
            callback(null);
        }
    })
};

exports.addNewGame = function (token,data, callback) {
    handleCmsConnection(token,function (err, acces) {
        if(err){
            console.send(err);
        }else if (acces){
            cmsModel.addNewGame(data.name, data.description,function (data) {
                callback(data);
            });
        }else {
            callback(null);
        }
    })
};

exports.updateGame = function (token,data, callback) {
    handleCmsConnection(token,function (err, acces) {
        if(err){
            console.send(err);
        }else if (acces){
            console.log(data)
            cmsModel.updateGame(data.id, data.name, data.description,function (data) {
                callback(data);
            });
        }else {
            callback(null);
        }
    })
};

exports.grantAdmin = function (token,email, callback) {
    handleCmsConnection(token,function (err, acces) {
        if(err){
            console.send(err);
        }else if (acces){
            cmsModel.grantAdmin(email,function (data) {
                callback(data);
            });
        }else {
            callback(null);
        }
    })
};

exports.revokeAdmin = function (token,email, callback) {
    handleCmsConnection(token,function (err, acces) {
        if(err){
            console.send(err);
        }else if (acces){
            cmsModel.revokeAdmin(email,function (data) {
                callback(data);
            });
        }else {
            callback(null);
        }
    })
};
