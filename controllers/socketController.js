const tableController=require('./tableController');
const redisController=require('./redisController');

const returnController = function(io){
    io.on('connection', function(socket){
        socket.on("chat",function(data){
            io.sockets.emit("chat",data);

        });

        socket.on("newUser",function(data){
            if(data.userName!=''){
                redisController.addConnectedUser(data);
                socket.broadcast.emit("userConnected",data);
                var redisClient=redisController.getClient();
                redisClient.smembers('listaSocketow',function(err,replies){
                    replies.forEach(function(reply){
                        redisClient.hgetall(['socket:'+reply],function(err,r) {
                            var user={
                                socketId:reply,
                                userName:r.userName,
                                userId:r.userId
                            };
                            socket.emit("userConnected",user);
                        });
                    });
                })
                tableController.getAllTablesInfo(function(data){
                    socket.emit("newTableToList",data);

                });
            }

        });
        socket.on("newUserTable",function(data){
            console.log("tutje");
            tableController.addConnectedUserToTable(data,function(){

            });
        });
        socket.on("disconnect",function(){
            console.log("rozlaczylo");
            tableController.moveFromTableDisconnectedPlayer(socket.id,function(canStandUp,idTable){
                io.sockets.emit("userDisconnected",socket.id);
                redisController.userDisconnected(socket.id);
                if(canStandUp) {
                    tableController.tableData(idTable, function (table) {
                        io.sockets.emit('updateTable', table);
                        io.sockets.emit('game'+idTable,table);
                    });
                }

            });
        });
        //table
        socket.on("createNewTable",function(data){
            console.log("tworze stol");
            tableController.addNewTable(data,function(res){
                tableController.tableData(res,function(response){
                    io.sockets.emit("newTableToList",response);
                });
            });
        });
        socket.on("newUserSit",function(data){
            tableController.seatInTableToPlay(data,function(playerCanSit){
                if(playerCanSit){
                    tableController.tableData(data.idTable,function(table){
                        io.sockets.emit('updateTable',table);
                        io.sockets.emit('game'+data.idTable,table);
                    });
                    socket.emit('myTable',data.idTable);

                }
                else{
                    console.log("error, nie mozna usiasc");
                }


            })
        });
        socket.on("standUp",function(data){
            tableController.standUpFromTable(data,function(canStandUp){
                if(canStandUp){
                    console.log("useerWstaje");
                    tableController.getAllTablesInfo(function(data){


                    })
                    tableController.tableData(data.idTable,function(table){
                        io.sockets.emit('updateTable',table);
                        io.sockets.emit("game"+data.idTable,table);
                    });
                }
            })

        });
        socket.on('readyToPlay',function(userAndBoardData){
            console.log("ktos jest ready");
            tableController.readyToPlay(userAndBoardData,function(isStartClicked){
                if(isStartClicked){
                    tableController.isAllReadyPlayers(userAndBoardData.idTable,function(){
                        tableController.tableData(userAndBoardData.idTable,function(tableData){
                            console.log(tableData);
                            console.log("ktos wystartowal");
                            io.sockets.emit('game'+userAndBoardData.idTable,tableData);
                        });
                    });
                };
            });
        });
        socket.on('move',function(moveData){

            tableController.move(moveData,function(dataPos){
                if(dataPos.gameOver!=0){
                    redisController.getMapValue(moveData.idTable,"numberOfPlayers",function(numberOfPlayers){
                       tableController.setUnreadSeats(moveData.idTable,numberOfPlayers,function() {
                           tableController.tableData(moveData.idTable,function(tableData){
                               io.sockets.emit('game'+moveData.idTable,tableData);
                           });
                       });
                    });
                };
                io.sockets.emit("game"+moveData.idTable+"position",dataPos);//and time
            });
        });
        socket.on("getTableData",function(data){
            tableController.tableData(data.idTable,function(tableData){
                console.log(tableData);
                socket.emit('game'+data.idTable,tableData);
            });

        });
    });
};
module.exports = returnController;