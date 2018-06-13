const cmsModel = require('../models/cmsModel');
const redisController = require('../controllers/redisController');

function addConfigsToRedis(){
    cmsModel.findAllGames(function (data) {
         if(data){
             for(let i = 0; i < data.length; i++) {
                 console.log(data[i][0]);
                 cmsModel.getConfig(data[i][0], function (config) {
                     console.log(config[0][0])
                     redisController.addConfig(data[i][0],config[0][0])
                 });
             }
         }
    });
}

module.exports.addConfigToRedis = addConfigsToRedis();