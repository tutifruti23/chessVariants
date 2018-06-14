var games = require('../models/gamesModel');
var gameData = require('../models/gameData');
exports.findAllGames = function (callback) {
    games.selectAllGames(function (data) {
        callback(data);
    });
};
exports.allActiveGames = function (callback) {
    games.allActiveGames(function (data) {
        callback(data);
    });
};
exports.gameData=function(idGame,callback){
    gameData.gameData(idGame,callback);
}
