const pg = require('./dbUtils');
const db = pg.getClient();

const getUserQuery= {
    text:"SELECT * FROM users WHERE id = $1",
    rowMode:'array'
};
const updateConfigQuery = "UPDATE users SET email = $1, password = $2, name = $3 WHERE id = $4";

exports.getUser = function (userID, handleUser) {
    db.query(getUserQuery, [userID], function (err,res){
        if(err){
            console.log('querry err ',err);
        } else{
            if(res.rowCount>0){
                handleUser(res.rows);
            }
            else {
                handleUser(null);
            }
        }
    });
};

exports.updateUser = function (userID, nick, mail, pass, handleUpdate){
    db.query(updateConfigQuery, [mail, pass, nick, userID], function(err, res){
        if(err){
            console.log('query err ',err)
        }else{
            handleUpdate(true);
        }
    });
};