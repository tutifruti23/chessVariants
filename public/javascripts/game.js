var socket;
var mySeat=-1;
window.addEventListener('load',function(){
    document.getElementById("plansza").innerHTML=game.layout();
    game.initGame();
    socket=io();
    socket.on("connect",function(){
        socket.emit("newUserTable",{idTable:idTable,userId:userId,socketId:socket.id});
        socket.emit("getTableData",{idTable:idTable});
    });
    socket.on("game"+idTable,function(tableData){
        updateTable(tableData);
        setNrMySeat(tableData);
        game.load(tableData.position);
    });
    socket.on("game"+idTable+'position',function(dataPos){
        updateGameInfo(dataPos.info);
        game.load(dataPos.position);
        updateTablePosition(dataPos['position']);
        updateTimes(dataPos.timers);
    });
    socket.on('deleteTable',function(idTable){
        deleteTable(idTable);
    });

});
function deleteTable(idTable){
    angular.element('[ng-controller=table]').scope().$apply(function(scope){
        if(scope.table.idTable==idTable){
            window.location.href = "/room";
        }

    });
}
function updateGameInfo(info){
    angular.element('[ng-controller=table]').scope().$apply(function(scope){
        scope.table.info=info;
    });
}
function updateTimes(timers){
    angular.element('[ng-controller=table]').scope().$apply(function(scope){
        for(var i=0;i<timers.length;i++){
            scope.table['seatTime'+i]=timers[i];
        }
    });
}
function updateTablePosition(position){
    angular.element('[ng-controller=table]').scope().$apply(function(scope){
        scope.table['position']=position;
    });
}
function updateTable(tableData){
    console.log(tableData);
    angular.element('[ng-controller=table]').scope().$apply(function(scope){
        scope.table=tableData;
    });
}
function setNrMySeat(tableData){
    var actSeat=mySeat;
    mySeat=-1;
    for(var i=0;i<tableData.numberOfPlayers;i++){
        if(tableData['seat'+i]==userId){
            mySeat=i;
            break;
        }
    }
    if(mySeat!=-1&&actSeat!=mySeat)
        game.rotateBoardForPlayer(mySeat);
}

var myApp=angular.module("myApp",[]);
myApp.controller('table',function($scope,$timeout){
    $scope.table;
    $scope.user=function(number){
        if(!this.table){
            return 'empty';
        }
        else if(this.table['seat'+number]==0){
            return 'empty';
        }

        else{
            return this.table['seatName'+number];
        }
    }
    $scope.isReady=function(number){
        if(!this.table){
            return '';
        }
        else if(this.table['seat'+number]==0){
            return '';
        }

        else if(this.table['seatReady'+number]==0){
            return 'red';
        }
        else if(this.table['seatReady'+number]==1){
            return 'green'
        }

    }
    $scope.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i < max; i += step) {
            input.push(i);
        }
        return input;
    };
    $scope.playerTimer=function(seatNr){
        var s=this.table['seatTime'+seatNr];
        function pad(n, z) {
            z = z || 2;
            return ('00' + n).slice(-z);
        }

        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
        if(hrs>0)
            return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);//+ '.' + pad(ms, 1);
        else
            return pad(mins) + ':' + pad(secs);// + '.' + pad(ms, 1);
    }
    $scope.seat=function(number){
        seatPlayer(idTable,number);

    };
    $scope.standUp=function(){
        standUpPlayer(idTable);
    }
    $scope.playerIsReady=function(seatNr){
        playerReady(seatNr);
    }
    $scope.status=function(){
        if(!this.table){
            return '';
        }
        else if(this.table['inProgress']==0){
            return 'not started';
        }

        else if(this.table['inProgress']==1){
            return 'started';
        }
    }
    var timer=function(){
        if($scope.table['inProgress']==1){
            var playersOnMove=game.playersOnMove($scope.table['position']);
            for(var i=0;i<playersOnMove.length;i++){
                if($scope.table['seatTime'+playersOnMove[i]]>0)
                    $scope.table['seatTime'+playersOnMove[i]]-=1000;
                else
                    $scope.table['seatTime'+playersOnMove[i]]=0;
            }
        }
        $timeout(timer, 1000);
    }
    $timeout(timer, 1000);

});

function seatPlayer(idTable,seatNr){
    socket.emit("newUserSit",{
        userId:userId,
        userName:userName,
        socketId:socket.id,
        idTable:idTable,
        seatNr:seatNr
    });

}
function standUpPlayer(idTable){
    socket.emit('standUp',{
        idTable:idTable,
        userId:userId
    });
}
function playerReady(seatNr){
    socket.emit('readyToPlay',{
       idTable:idTable,
       userId:userId,
       seatNr:seatNr
    });
}
function makeMove(move){
    if(mySeat!=-1){
        socket.emit('move',{
            idTable:idTable,
            userId:userId,
            seatNr:mySeat,
            move:move
        });
    }
}



