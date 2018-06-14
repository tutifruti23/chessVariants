const pg = require('./dbUtils');
const validateLoginQuery = "SELECT * FROM users WHERE email = $1 and password = $2";

const db = pg.getClient();

exports.validateDataLogin = function(email,password,handleValidateData){
    db.query(validateLoginQuery,[email,password], function (err,res){
       if(err){
           console.log('querry err ',err);
       } else{
           if(res.rowCount>0){
               var data={
                   id:res.rows[0].id,
                   name:res.rows[0].name,
                   admin:res.rows[0].admin
               };
               handleValidateData(true, data);
           }
           else {
               handleValidateData(false, {});
           }
       }
    });
};

exports.validateDataRegister = function(name,email,password,fromGoogle,handleValidateData){
    const Query = "SELECT email FROM users WHERE email = $1";
    const InsQuery="INSERT INTO users(id,email,password,name,avatar,admin,from_google) VALUES((SELECT (MAX(ID) + 1) FROM users),$1,$2,$3,'',false,$4) RETURNING id,name,admin";
   db.query(Query,[email], function (err,res){
        if(err){
            console.log('query err ',err);
            handleValidateData(false,null);
        } else{
            if(res.rowCount==0){
                db.query(InsQuery,[email,password,name,fromGoogle],function (err,res) {
                    var data={
                        id:res.rows[0].id,
                        name:res.rows[0].name,
                        admin:res.rows[0].admin
                    };
                    handleValidateData(true,data);
                });
            }else {
                 handleValidateData(false,null);
            }
        }
    });

};
