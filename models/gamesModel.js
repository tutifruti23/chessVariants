const pg = require('./dbUtils');

const db = pg.getClient();

const selectAllGamesQuery = {
    text:"SELECT id,name,description,picture FROM available_games",
    rowMode:'array'
};

exports.selectAllGames = function (handleFindAllGames) {
    db.query(selectAllGamesQuery, function (err,res){
        if(err){
            console.log('querry err ',err);
        } else{
            if(res.rowCount>0){
                handleFindAllGames(res.rows);
            }
            else {
                handleFindAllGames(null);
            }
        }
    });
};