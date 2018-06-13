const pg = require('./dbUtils');
const allGamesQuery = {
    text:"SELECT id,name FROM available_games",
    rowMode:'array'
};

const getConfigQuery = {
    text:"SELECT config FROM configurations WHERE available_games_id = $1",
    rowMode:'array'
};
const getGameDetailsQuery = {
    text:"SELECT name, description, active FROM available_games WHERE id = $1",
    rowMode:'array'
};


const updateConfigQuery = "UPDATE configurations SET config = $2 WHERE available_games_id = $1";
const addNewGameQuery = "INSERT INTO available_games(id, name, description) VALUES((SELECT (MAX(ID) + 1) FROM available_games),$1, $2) RETURNING id";
const addNewGameConfigQuery = "INSERT INTO configurations(id, available_games_id) VALUES((SELECT (MAX(ID) + 1) FROM configurations),$1)";
const grantAdminQuery = "UPDATE users SET admin = true WHERE email = $1";
const revokeAdminQuery = "UPDATE users SET admin = false WHERE email = $1";
const updateGameQuery = "UPDATE available_games SET name = $2, description = $3 WHERE id = $1";
const changeActiveGameQuery = "UPDATE available_games SET active = $2 WHERE id = $1";
const deleteGameQuery = "DELETE FROM available_games WHERE id = $1";
const deleteConfigQuery = "DELETE FROM configurations WHERE available_games_id = $1";

const db = pg.getClient();

exports.findAllGames = function (handleFindAllGames) {
    db.query(allGamesQuery, function (err,res){
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

exports.getGameDetails = function(id,handlegetGameDetails){
    db.query(getGameDetailsQuery,[id], function (err,res){
        if(err){
            console.log('querry err ',err);
        } else{
            if(res.rowCount>0){
                handlegetGameDetails(res.rows);
            }
            else {
                handlegetGameDetails(null);
            }
        }
    });
};

exports.deleteGame = function(id,callback){
    db.query(deleteConfigQuery,[id], function (err,res){
        if(err){
            console.log('querry err ',err);
        } else{
            db.query(deleteGameQuery,[id], function (err,res) {
                if (err) {
                    console.log('querry err ', err);
                } else {
                    callback(true);
                }
            });
        }
    });
};

exports.getConfig = function (configId,handleGetConfig) {
    console.log('dsadasdsadasd',typeof parseInt(configId))
    db.query(getConfigQuery,[configId], function (err,res){
        if(err){
            console.log('querry err ',err);
        } else{
            if(res.rowCount>0){
                handleGetConfig(res.rows);
            }
            else {
                handleGetConfig(null);
            }
        }
    });
};

exports.changeActiveGame = function (gameId,value,callback) {
    db.query(changeActiveGameQuery,[gameId,value], function (err){
        if(err){
            console.log('querry err ',err);
        } else{
            callback(true);
        }
    });
};


exports.updateConfig = function (configId,configData,handleUpdateConfig) {
    let stringifyedProperly = JSON.stringify(JSON.parse(configData));
    console.log( stringifyedProperly)
    db.query(updateConfigQuery,[configId,stringifyedProperly], function (err,res){
        if(err){
            console.log('querry err ',err);
        } else{
            handleUpdateConfig(true);
        }
    });
};

exports.addNewGame = function (name,description,handleUpdateConfig) {
    db.query(addNewGameQuery,[name,description], function (err,res){
        if(err){
            console.log('querry err ',err);
        } else{
            console.log(res.rows[0].id)
            db.query(addNewGameConfigQuery,[res.rows[0].id], function (err,res) {
                if(err){
                    console.log('querry err ',err);
                } else {
                    handleUpdateConfig(true);
                }
            });
        }
    });
};

exports.updateGame = function (id,name,description,callback) {
    db.query(updateGameQuery,[id,name,description], function (err,res){
        if(err){
            console.log('querry err ',err);
        } else{
            callback(true);
        }
    });
};

exports.grantAdmin = function (email,handleGrantAdmin) {
    db.query(grantAdminQuery,[email], function (err,res){
        if(err){
            console.log('querry err ',err);
        } else{
            handleGrantAdmin(true);
        }
    });
};

exports.revokeAdmin = function (email,handleGrantAdmin) {
    db.query(revokeAdminQuery,[email], function (err,res){
        if(err){
            console.log('querry err ',err);
        } else{
            handleGrantAdmin(true);
        }
    });
};