const pg = require('./dbUtils');
const validateLoginQuery = "SELECT * FROM configurations";
const db = pg.getClient();
exports.configs=function(callback){
    db.query(validateLoginQuery, function (err, res) {
        var gameControllers={};
        if (err) {
            console.log('querry err ', err);
            callback({});
        } else {
            for(var i=0;i<res.rows.length;i++){
            }
            callback(gameControllers)
        }
    });
};
exports.gameData=function(idGame,callback){
    var query = "SELECT * FROM available_games where id=$1";
    db.query(query,[idGame], function (err, res) {
        if (err) {
            console.log('querry err ', err);
        } else {

            if (res.rowCount > 0) {
                var gameData = {
                    idGame: res.rows[0].id,
                    name: res.rows[0].name,
                };
                callback(gameData);
            }
        };
    });
};
