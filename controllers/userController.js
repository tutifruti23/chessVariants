var user = require('../models/userModel');

exports.getUser = function (userID, callback) {
    user.getUser(userID,callback);
};

exports.updateUser = function (id, nick, mail, pass, callback) {
    user.updateUser(id ,nick, mail, pass, callback);
};