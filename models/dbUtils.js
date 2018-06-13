var pg = require('pg');
const connectionString = 'postgres://25952734_zpi:ZPI2018*@serwer1784051.home.pl:5432/25952734_zpi';
var db;

module.exports={
    connectToServer: function (callback) {
        db = new pg.Client(connectionString);
        db.connect(function (err) {
            if(err){
                console.log("db conn err: "+err)
            }
            console.log("connected to db!");
            callback();
        });
    },
    getClient:function () {
        return db;
    }
};