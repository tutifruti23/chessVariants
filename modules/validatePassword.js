var passwordValidator = require('password-validator');
function isValidPassword(password){

    var schema=new passwordValidator();
    schema.is().min(6);
    schema.is().max(30);
    return schema.validate(password);
}
module.exports.isValidPassword=isValidPassword;