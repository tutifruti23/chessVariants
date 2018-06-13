var games = require('../models/gamesModel');
var gameData = require('../models/gameData');
exports.findAllGames = function (callback) {
    games.selectAllGames(function (data) {
        console.log(data);
        callback(data);
    });
};
exports.gameData=function(idGame,callback){
    gameData.gameData(idGame,callback);
}
