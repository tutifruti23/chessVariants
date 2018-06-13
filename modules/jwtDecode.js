var jwt = require('jsonwebtoken');

function decode(token,callback){
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        callback(decoded) // bar
    });
}

module.exports.decode = decode;