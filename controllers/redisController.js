var redis=require('redis');
var tabUser=[];
var tabSockets=[];
var tabUserName=[];
var tabUserId=[];
//list users
redisClient = redis.createClient(24809, "ec2-52-2-220-105.compute-1.amazonaws.com");
redisClient.auth("pecd503719e99ee58515c3d6ebb6e1394fd2f6acda5921e38afa798fb2c32d168", function() {console.log("Connected!");});
exports.getClient=function(){return redisClient};
exports.serverConnect=function(){
    redisClient.del('listaSocketow');
};
exports.addConnectedUser=function(userData){
    redisClient.sadd('listaSocketow',[userData.socketId]);
    redisClient.hset(['socket:'+userData.socketId,'userName',userData.userName]);
    redisClient.hset(['socket:'+userData.socketId,'userId',userData.userId]);
};
exports.userDisconnected=function(socketId){
    redisClient.srem('listaSocketow',[socketId])
    redisClient.del('socket:'+socketId);
};
//list boards
exports.getValue=function(key,callback){
    redisClient.get(key,function(err,res){
        console.log("res:"+res);
        if(!err)
        callback(res);
    });


}
exports.setValue=function(key,value){
    redisClient.set(key,value);
}
exports.removeValue=function(key){
    redisClient.del(key);
};
exports.getMapValues=function(key,callback){
    redisClient.hgetall(key,function(err,res){
       if(!err)
           callback(res);
    });
}
exports.incrValue=function (key) {
    redisClient.incr(key);
}
exports.setMapKey=function(key,keyValue,value){
    redisClient.hset([key,keyValue,value]);

}
exports.getMapValue=function(key,keyValue,callback){
    redisClient.hget([key,keyValue],function(err,res){
        if(err){

        }
        else {
            callback(res);
        }
    });

};
exports.isOnList=function(key,value,callback){
    redisClient.sismember(key,value,function(err,res){
        console.log('odpowiedz');
        console.log(res);
        callback(res);
    });


}
exports.removeSetElement=function(key,value){

    redisClient.srem(key,[value])

}
exports.addToList=function(key,value){
    redisClient.sadd([key,value]);
}
exports.getList=function(key,callback){
    redisClient.smembers(key,function(err,res){
       if(err) {
           console.log(err);
       }else{
           callback(res);
       }
    });
};


exports.addConfig = function (gameId, config){
    redisClient.hmset('config'+gameId,config);
};

exports.getConfig = function (gameId,callback){
    redisClient.hgetall('config'+gameId, function (err, data) {
        if(err){
            console.log(err);
        }else{
            callback(data);
        }
    });
};





