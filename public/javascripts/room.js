var myApp=angular.module("myApp",[]);
var socket;
var nrSeat;
myApp.controller('listaUzytkownikow',function($scope){
    var listaUserow=[];
    $scope.listaUserow=listaUserow;
    //lista uzytkowanikow
    $scope.dodajUzytkownika=function(user){
        this.listaUserow.push(user);
    };
    $scope.usunUzytkownika=function(_socketId){
        this.listaUserow=this.listaUserow.filter(function(el) { return el.socketId != _socketId; });
    };
    $scope.addUsers=function(userTable){
        Array.prototype.push.apply(this.listaUserow,userTable);
    };

});

myApp.controller('tableList',['$scope', '$window', function($scope, $window){
    var tableList=[];
    $scope.myTable=0;
    $scope.tableList=tableList;
    //lista stolow
    $scope.tablePlayers=function(table){
        var tablePlayers=[];
        for(var i=0;i<table['numberOfPlayers'];i++){
            var player={};
            player['name']=table['seatName'+i];
            player['seat']=table['seat'+i];
            tablePlayers.push(player);
        }
        return tablePlayers;
    }
    $scope.redirect=function(idTable){
      $window.location.href='/game?id='+idTable;
    };
    $scope.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i < max; i += step) {
            input.push(i);
        }
        return input;
    };
    $scope.addTable=function(table){
        this.tableList.push(table);
    };
    $scope.deleteTable=function(idTable){
        this.tableList=this.tableList.filter(function(el) { return el.idTable !=idTable; });
    };
}]);


window.addEventListener("load",function(){
    socket=io();

    socket.on("connect",function(){
        socket.emit("newUser",{userId:userId,userName:userName,socketId:socket.id});
    });

    socket.on("userConnected",function(data){
        angular.element('[ng-controller=listaUzytkownikow]').scope().$apply(function(scope){
            scope.dodajUzytkownika(data);
        });
    });

    socket.on("connectedUsersList",function(userTable){
        console.log('odbieram liste uzytkownikow');
        angular.element('[ng-controller=listaUzytkownikow]').scope().$apply(function(scope){
            scope.addUsers(userTable);
        });

    });

    var btn=document.getElementById("send");
    var message=document.getElementById("message");
    var output=document.getElementById("output");
    btn.addEventListener("click",function(){
        if(message.value!=""){
            socket.emit("chat",{
                userName:userName,
                message: message.value
            });
        }
        message.value="";
    });
    $(document).keypress(function (e) {
        if (e.which == 13) {
            if(message.value!=""){
                socket.emit("chat",{
                    userName:userName,
                    message: message.value
                });
            }
            message.value="";
        }
    });
    socket.on("userDisconnected",function(socketId){
        angular.element('[ng-controller=listaUzytkownikow]').scope().$apply(function(scope){
            scope.usunUzytkownika(socketId);
        });
    });
    socket.on("chat",function (data) {
        output.innerHTML+="<p><strong>"+ data.userName+"</strong>: "+data.message+"</p>";
        var height= output.scrollHeight;
        output.scrollTo(0, height);

    })
    //nowa gra
    document.getElementById("newGame").addEventListener("click",function(){

        var idGame=document.getElementById('idGame').value;
        var time=document.getElementById('timeGame').value;
            socket.emit("createNewTable", {
                idGame: idGame,
                time:time
            });

    });
    //tableList
    socket.on("newTableToList",function(table){
        console.log(table);
        angular.element('[ng-controller=tableList]').scope().$apply(function(scope){
            scope.addTable(table);
        });
    });
    socket.on("updateTable",function(table){
        console.log(table);
        angular.element('[ng-controller=tableList]').scope().$apply(function(scope){
            scope.deleteTable(table.idTable);
            scope.addTable(table);
        });
    });
    socket.on("deleteTable",function(idTable){
        angular.element('[ng-controller=tableList]').scope().$apply(function(scope){
            scope.deleteTable(idTable);
        });
    });
});
