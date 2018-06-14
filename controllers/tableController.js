/*
REDIS STRUCTURE
    nextIdTable - value

    mapTable -
        'table'+idTable{
            'idTable' // key value
            'numberOfPlayers'   //int
            'seat'+numberOfSeat // 0 - empty , if >0 idUser, first index 0
            'seatName'+numberOfSeat // player name
            'seatReady'+numberOfSeat // 0 - not click start 1 - clicked start
            'seatTime'+numberOfSeat //time for player in ms
            'gameTime'          // time to play, default: 300s
            'inProgress'       //0 -no, 1 -yes
            'idGame'
            'gameName'
            'info'
        }
    listOfTable-
        key:tableList value:idTable
 */
var io=require('../app').io;
var timers={};
var Stopwatch=require('timer-stopwatch');
var uniqid=require('uniqid');
var gameData=require('./gamesController');
var redisController=require('./redisController');
var gameController=require('./gameController');
var gameControllers=gameController.gameController;
    function tableData(tableId,callback){
        redisController.getMapValues(tableId,function(data){
            callback(data);
        });
    }
    function setFreeSeat(tableKey,number,time){
        for(var i=0;i<number;i++){
            redisController.setMapKey(tableKey,'seat'+i,0);
            redisController.setMapKey(tableKey,'seatReady'+i,0);
            redisController.setMapKey(tableKey,'seatName'+i,"");
            redisController.setMapKey(tableKey,'seatTime'+i,time*1000);
        }
    }

    function setUnreadySeats(tableKey,number,callback){
        for(var i=0;i<number;i++){
            redisController.setMapKey(tableKey,'seatReady'+i,0);
        }
        callback();
    }
    exports.setUnreadSeats=setUnreadySeats;
    function standUpFromTable(data,callback){
        tableData(data.idTable,function(response){
            var canStandUp=false;
            var index=0;
            if(response['inProgress']=='0'){
                for(var i=0;i<response.numberOfPlayers;i++){
                    if(response['seat'+i]==data.userId){
                        canStandUp=true;
                        index=i;
                    }
                }
            }
            if(canStandUp){
                redisController.setMapKey(data.idTable,'seat'+index,0);
                redisController.setMapKey(data.idTable,'seatReady'+index,0);
                redisController.setMapKey(data.idTable,'seatName'+index,"");
                redisController.removeSetElement('userSitList',data.userId);
                redisController.removeValue('userTable'+data.userId);
                callback(true,data.idTable);
            }
            else{

                callback(false);
            }
        });
    }
    exports.isAllReadyPlayers=function(idTable,callback){
        tableData(idTable,function(response){
            if(response["inProgress"]=='0') {


                var allReady = true;
                for (var i = 0; i < response['numberOfPlayers']; i++) {
                    if (response['seatReady' + i] == 0) {
                        allReady = false;
                    }
                }
                if (allReady) {
                    redisController.getMapValue(idTable, 'gameTime', function (time) {
                        redisController.getMapValue(idTable, 'numberOfPlayers', function (numOfPlayers) {
                            initClocks(idTable, time, numOfPlayers);
                            redisController.setMapKey(idTable, 'position', gameControllers[response['idGame']].startPosition());
                            redisController.setMapKey(idTable, 'info', gameControllers[response['idGame']].startInfo());
                            redisController.setMapKey(idTable, 'inProgress', 1);
                            changeUsersOnMove(idTable, gameControllers[response['idGame']].firstUsersOnMove());
                            callback();
                        });
                    });
                }
                else {
                    callback();
                }
            }
        });
    }
    exports.clearEmptyTables=function(callback){
        var time=120000;
        var tableTime=30000
        var options = {
            refreshRateMS: time		// How often the clock should be updated
	// When counting down - this event will fire with this many milliseconds remaining on the clock
        }
        var tableTimerOptions = {
            refreshRateMS: 5000		// How often the clock should be updated
            // When counting down - this event will fire with this many milliseconds remaining on the clock
        }
        var st=new Stopwatch(time,options);
        st.onDone(function(){
            redisController.getList('tableList',function(tables){
                tables.forEach(function(tableId){
                    tableData(tableId,function(table){
                       if(isEmptyTable(table)){
                           var stTab=new Stopwatch(tableTime,tableTimerOptions);
                           stTab.onTime(function(){
                               tableData(tableId,function(tab){
                                   if(!isEmptyTable(tab)){
                                       stTab.stop(time);
                                       stTab=null;
                                   }
                               });
                           });
                           stTab.onDone(function(){
                               tableData(tableId,function(tab){
                                   if(isEmptyTable(tab)){
                                       redisController.removeSetElement('tableList',tableId);
                                       redisController.removeValue(tableId);
                                       callback(tableId);
                                   }
                               });
                           });
                           stTab.start();
                       }


                    });
                })
                st.reset(time);
                st.start();
            });
        });
        st.start();
    }
    function isEmptyTable(table){
        var empty=true;
        for(var i=0;i<table.numberOfPlayers;i++){
            if(table['seatName'+i]!='')
                empty=false;
        }
        return empty;
    }
    exports.addConnectedUserToTable=function(userData,callback){

        redisClient.sadd('listaSocketowTable',[userData.socketId]);
        redisClient.hset(['socket:'+userData.socketId,'userId',userData.userId]);
        redisClient.hset(['socket:'+userData.socketId,'idTable',userData.idTable]);
    };
    exports.standUpFromTable=standUpFromTable;
    //data{
    //     idTable:,
    //     idPlayer:,
    //     playerName:,
    //     numOfSeat:
    // }
    exports.readyToPlay=function(data,callback){
        var num=data.seatNr;
        var idTable=data.idTable;
        var userId=data.userId;
        redisController.getMapValue(idTable,"inProgress",function(inProgress) {
            if(inProgress=='0'){
                redisController.getMapValue(idTable, 'seat' + num, function (res) {

                    if (res == userId) {
                        redisController.setMapKey(idTable, 'seatReady' + num, 1);
                        callback(true);
                    }
                    else {
                        callback(false);
                    }
                });
            }

        });
    };

    exports.endOfGame=function(data,callback){


    };
    //data{
    //     idTable:,
    //     idPlayer:,
    //     playerName:,
    //     numOfSeat:
    // }
    exports.seatInTableToPlay=function(data,callback){
        var idTable=data.idTable;
        var playerName=data.userName;
        var idPlayer=data.userId;
        var num=data.seatNr;
        redisController.isOnList('userSitList',idPlayer,function(isOnList) {
            tableData(data.idTable, function (tableData) {
                var canPlayerSit = !isOnList;
                for (var i = 0; i < tableData.numberOfPlayers; i++) {

                    if (tableData['seat' + i] == idPlayer) {
                        canPlayerSit = false;
                    }
                }
                if (tableData['seat' + num] != 0) {
                    canPlayerSit = false;
                }
                if (canPlayerSit) {
                    redisController.setMapKey(idTable, 'seat' + num, idPlayer);
                    redisController.setMapKey(idTable, 'seatName' + num, playerName);
                    redisController.addToList('userSitList', idPlayer);
                    redisController.setValue("userTable"+data.userId,data.idTable);
                }
                callback(canPlayerSit);
            });
        });


    };
    exports.moveFromTableDisconnectedPlayer=function(socketId,callback){
        redisController.getMapValue('socket:'+socketId,'userId',function(userId){
            redisController.getValue('userTable'+userId,function(idTable){
                    if(idTable){
                        standUpFromTable({
                            userId:userId,
                            idTable:idTable
                        },callback);
                    }
                    else{callback(false)};

            });
        });
    };
    exports.tableData=tableData;
    exports.addNewTable=function(boardData,callback){
        var idGame=boardData.idGame;
        var timeGame=boardData.time;
        var numberOfPlayersInGame=gameControllers[idGame].numberOfPlayers();
        var idTable = uniqid();
        gameData.gameData(idGame,function (gameData)
        {
            redisController.setMapKey(idTable, 'numberOfPlayers', numberOfPlayersInGame);
            setFreeSeat(idTable, numberOfPlayersInGame,timeGame);
            redisController.setMapKey(idTable, 'idTable', idTable);
            redisController.setMapKey(idTable, 'inProgress', 0);
            redisController.setMapKey(idTable, 'idGame', idGame);
            redisController.setMapKey(idTable, 'info', '');
            redisController.setMapKey(idTable, 'position', '0000000001');
            redisController.addToList('tableList', idTable);
            redisController.setMapKey(idTable,'gameName',gameData.name);
            redisController.setMapKey(idTable,'gameTime',timeGame);
            callback(idTable);
        });
    };
    exports.getAllTablesInfo=function(callback){
        redisController.getList('tableList',function(tables){
            tables.forEach(function(tableId){
                tableData(tableId,callback);
            })
        });
    };
    // game
    exports.move=function(moveAndData,callback){
        redisController.getMapValue(moveAndData.idTable,'inProgress',function(inProgress){
            if(inProgress==1){
                redisController.getMapValue(moveAndData.idTable, 'seat' + moveAndData.seatNr, function (data) {
                    if (data == moveAndData.userId) {
                        redisController.getMapValue(moveAndData.idTable, 'position', function (position) {
                            redisController.getMapValue(moveAndData.idTable,'idGame',function(index){
                                gameControllers[index].makeMove(moveAndData.move, moveAndData.seatNr, position, function (dataPos) {
                                    if (dataPos.change) {
                                        changeUsersOnMove(moveAndData.idTable,dataPos.playersOnMove);
                                        redisController.setMapKey(moveAndData.idTable,'info',dataPos.info);
                                        redisController.setMapKey(moveAndData.idTable, "position", dataPos.position);
                                        var timersTable=[];
                                        for(var i=0;i<timers[moveAndData.idTable].length;i++){
                                            timersTable[i]=timers[moveAndData.idTable][i].ms;
                                        }
                                        dataPos.timers=timersTable;
                                        if(dataPos.gameOver!=0){
                                            redisController.setMapKey(moveAndData.idTable,'inProgress','0');
                                            redisController.getMapValue(moveAndData.idTable,'gameTime',function(time){
                                                stopAllClocks(moveAndData.idTable);
                                                initClocks(moveAndData.idTable,time,timers[moveAndData.idTable].length);
                                            });

                                        }
                                        callback(dataPos);
                                    }
                                });
                            });
                        });
                    }
                });
            }
        });
    };

    //time
function changeUsersOnMove(idTable,usersOnMove){
    stopAllClocks(idTable);
    for(var i=0;i<usersOnMove.length;i++){
        startClock(idTable,usersOnMove[i]);
    }
}

function stopAllClocks(idTable) {
    var length = timers[idTable].length;
    for (var i = 0; i < length; i++) {
        timers[idTable][i].stop();
    }
}
function startClock(idTable,n){
    timers[idTable][n].start();
}
function timerInstance(time,idTable,i){
    var options = {
        refreshRateMS: 1000,		// How often the clock should be updated
        almostDoneMS: 10000, 	// When counting down - this event will fire with this many milliseconds remaining on the clock
    }
    var timer=new Stopwatch(time,options);
    timer.onTime(function(time){
        redisController.setMapKey(idTable,'seatTime'+i,time.ms);
    });
    timer.onDone(function(){
        redisController.getMapValue(idTable,'position',function(position){
           redisController.getMapValue(idTable,'idGame',function(idGame){
              gameControllers[idGame].playerTimeout(position,i,function(dataPos){
                  if (dataPos.change) {
                      changeUsersOnMove(idTable,dataPos.playersOnMove);
                      redisController.setMapKey(idTable,'info',dataPos.info);
                      redisController.setMapKey(idTable, "position", dataPos.position);
                      var timersTable=[];
                      for(var i=0;i<timers[idTable].length;i++){
                          timersTable[i]=timers[idTable][i].ms;
                      }
                      dataPos.timers=timersTable;
                      if(dataPos.gameOver!=0){
                          redisController.setMapKey(idTable,'inProgress','0');
                          redisController.getMapValue(idTable,'gameTime',function(time) {
                              stopAllClocks(idTable);
                              initClocks(idTable, time, timers[idTable].length);
                              redisController.getMapValue(idTable, "numberOfPlayers", function (numberOfPlayers) {
                                      setUnreadySeats(idTable, numberOfPlayers, function () {
                                      tableData(idTable, function (tableData) {
                                          io.sockets.emit('game' +idTable, tableData);
                                      });
                                  });


                              });
                          });
                      }
                      else{
                          io.sockets.emit("game" + idTable + "position", dataPos);
                      }
                  }
              });
           });
        });
    });
    return timer;
}
function initClocks(idTable,time,count){
    if(timers[idTable]==null){
        timers[idTable]=[];
        time=time*1000;
        for(var i=0;i<count;i++){
            timers[idTable][i]=timerInstance(time,idTable,i+1);
            redisController.setMapKey(idTable,'seatTime'+i,time);
        }
    }else{
        var length = timers[idTable].length;
        for (var i = 0; i < length; i++) {
            timers[idTable][i].stop();
            timers[idTable][i].reset();
        }

    }
}