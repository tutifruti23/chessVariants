

function isValidJSON(json) {
    try{
        JSON.parse(json);
        return true;
    }catch(e){
        return false;
    }
}
module.exports.isValidJSON=isValidJSON;