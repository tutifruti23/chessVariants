var chess = require('chess').Chess;
exports.gameController={
    '1':{
        startPosition:function(){return "0000000001";},
        startInfo:function(){return "";},
        firstUsersOnMove:function(){return [0]},
        numberOfPlayers:function(){return 2},
        playerTimeout:function(position,i,callback){

            callback({change:true,position:position,gameOver:1,info:'Koniec gry',playersOnMove:[]});
        },
        makeMove:function(move,nrPlayer,position,callback){
            nrPlayer++;
            var turn=position.charAt(9);
            if(nrPlayer==turn)
            {
                if(position.charAt(move)=='0') {
                    var index=move;
                    position = position.substr(0, index) + nrPlayer + position.substr(index + 1);
                    var nextPlayer;
                    if(nrPlayer==1){
                        nextPlayer=2;
                    }
                    else{
                        nextPlayer=1;
                    }
                    index=9;
                    position = position.substr(0, index) + nextPlayer + position.substr(index + 1);
                    var over=this.gameOver(position);
                    var info="";
                    if(over!=0){
                        info="Koniec gry";
                    }
                    var playersOnMove=[];
                    playersOnMove.push(nextPlayer-1);
                    callback({change:true,position:position,gameOver:over,info:info,playersOnMove:playersOnMove});
                }
                else{
                    callback({change:false});
                }

            }else{
                callback({change:false});
            }

        },
        gameOver:function (position){
            var i=0;
            var plansza=[];
            var rozmiar=9;

            for(i=0;i<rozmiar;i++){
                plansza[i]=position.charAt(i);
            }
            var koniec=0;
            for(var i=0;i<rozmiar;i=i+3){
                if(plansza[i]!=0){
                    if(plansza[i]==plansza[i+1]&&plansza[i]==plansza[i+2]){
                        koniec=plansza[i];
                    }
                }
            }
            for(var i=0;i<3;i++){
                if(plansza[i]!=0){
                    if(plansza[i]==plansza[i+3]&&plansza[i]==plansza[i+6]){
                        koniec=plansza[i];
                    }
                }
            }
            if(plansza[4]!=0){
                if(plansza[0]==plansza[4]&&plansza[0]==plansza[8]){
                    koniec=plansza[4];
                }
                else if(plansza[2]==plansza[4]&&plansza[2]==plansza[6]){
                    koniec=plansza[4];
                }
            }
            var full=true;
            if(koniec==0){
                for(var i=0;i<rozmiar;i++){
                    if(plansza[i]=='0'){
                        full=false;
                    }
                }
            }
            if(full){
                return 'X';
            }
            return koniec;
        }
    },
    '2':{
        startPosition:function(){return "0000000001";},
        startInfo:function(){return "";},
        firstUsersOnMove:function(){return [0]},
        numberOfPlayers:function(){return 2},
        playerTimeout:function(position,i,callback){

            callback({change:true,position:position,gameOver:1,info:'Koniec gry',playersOnMove:[]});
        },
        makeMove:function(move,nrPlayer,position,callback){
            nrPlayer++;
            var turn=position.charAt(9);
            if(nrPlayer==turn)
            {
                if(position.charAt(move)=='0') {
                    var index=move;
                    position = position.substr(0, index) + nrPlayer + position.substr(index + 1);
                    var nextPlayer;
                    if(nrPlayer==1){
                        nextPlayer=2;
                    }
                    else{
                        nextPlayer=1;
                    }
                    index=9;
                    position = position.substr(0, index) + nextPlayer + position.substr(index + 1);
                    var over=this.gameOver(position);
                    var info="";
                    if(over!=0){
                        info="Koniec gry";
                    }
                    var playersOnMove=[];
                    playersOnMove.push(nextPlayer-1);
                    callback({change:true,position:position,gameOver:over,info:info,playersOnMove:playersOnMove});
                }
                else{
                    callback({change:false});
                }

            }else{
                callback({change:false});
            }

        },
        gameOver:function (position){
            var i=0;
            var plansza=[];
            var rozmiar=9;

            for(i=0;i<rozmiar;i++){
                plansza[i]=position.charAt(i);
            }
            var koniec=0;
            for(var i=0;i<rozmiar;i=i+3){
                if(plansza[i]!=0){
                    if(plansza[i]==plansza[i+1]&&plansza[i]==plansza[i+2]){
                        koniec=plansza[i];
                    }
                }
            }
            for(var i=0;i<3;i++){
                if(plansza[i]!=0){
                    if(plansza[i]==plansza[i+3]&&plansza[i]==plansza[i+6]){
                        koniec=plansza[i];
                    }
                }
            }
            if(plansza[4]!=0){
                if(plansza[0]==plansza[4]&&plansza[0]==plansza[8]){
                    koniec=plansza[4];
                }
                else if(plansza[2]==plansza[4]&&plansza[2]==plansza[6]){
                    koniec=plansza[4];
                }
            }
            var full=true;
            if(koniec==0){
                for(var i=0;i<rozmiar;i++){
                    if(plansza[i]=='0'){
                        full=false;
                    }
                }
            }
            if(full){
                return 'X';
            }
            return koniec;
        }
    },
    '3':{
        startPosition:function(){return "0000000000000000000000000000000000001";},
        startInfo:function(){return "";},
        firstUsersOnMove:function(){return [0]},
        numberOfPlayers:function(){return 2},
        playerTimeout:function(position,i,callback){

            callback({change:true,position:position,gameOver:1,info:'Koniec gry',playersOnMove:[]});
        },
        makeMove:function(move,nrPlayer,position,callback){
            nrPlayer++;
            var turn=position.charAt(36);
            if(nrPlayer==turn)
            {
                if(position.charAt(move)=='0') {
                    var index=move;
                    position =this.positionAfterMove(move,position,turn);
                    var over=this.gameOver(position);
                    var info="";
                    if(over!=0){
                        info="Koniec gry";
                    }
                    if(turn==2)
                        turn=1;
                    else
                        turn=2;
                    var playersOnMove=[];
                    playersOnMove.push(turn-1);
                    callback({change:true,position:position,gameOver:over,info:info,playersOnMove:playersOnMove});
                }
                else{
                    callback({change:false});
                }

            }else{
                callback({change:false});
            }

        },
        gameOver:function (position){
            var plansza=[];
            var rozmiar=36;

            for(var i=0;i<rozmiar;i++){
                plansza[i]=position.charAt(i);
            }
            var koniec=0;
            var full=true;
            if(koniec==0){
                for(var i=0;i<rozmiar;i++){
                    if(plansza[i]=='0'){
                        full=false;
                    }
                }
            }
            if(full){
                return 'X';
            }
            return koniec;
        },positionAfterMove:function (move,position,turn) {
            var plansza=[];
            var rozmiar=36;
            move=parseInt(move);
            for(var i=0;i<rozmiar;i++){
                plansza[i]=position.charAt(i);
            }
            plansza[move]=turn;
            var pelno=true;
            for(var i=move%6;i<rozmiar;i=i+6){
                if(plansza[i]==0){
                    pelno=false;
                }
            }
            if(pelno){
                for(var i=move%6;i<rozmiar;i=i+6){

                    plansza[i]=turn;
                }
            }
            pelno=true;
            for(var i=parseInt((move/6))*6;i<parseInt((move/6))*6+6;i++){
                if(plansza[i]==0){
                    pelno=false;
                }
            }
            if(pelno){
                for(var i=parseInt((move/6))*6;i<parseInt((move/6))*6+6;i++){
                    plansza[i]=turn;
                }
            }
            if(turn==1){
                turn=2;
            }
            else{
                turn=1;
            }
            var newPosition="";
            for(var i=0;i<rozmiar;i++){

                newPosition+=plansza[i]+"";
            }
            newPosition+=turn;
            console.log(newPosition);
            return newPosition;
        }
    },
    '4':{
        startPosition:function(){return "0000000001";},
        startInfo:function(){return "";},
        firstUsersOnMove:function(){return [0]},
        numberOfPlayers:function(){return 1},
        playerTimeout:function(position,i,callback){

            callback({change:true,position:position,gameOver:1,info:'Koniec gry',playersOnMove:[]});
        },
        makeMove:function(move,nrPlayer,position,callback){
            nrPlayer++;
            var turn=position.charAt(9);
            if(nrPlayer==turn)
            {
                if(position.charAt(move)=='0') {
                    var index=move;
                    position = position.substr(0, index) + nrPlayer + position.substr(index + 1);
                    var nextPlayer;
                    if(nrPlayer==1){
                        nextPlayer=2;
                    }
                    else{
                        nextPlayer=1;
                    }
                    index=9;
                    position = position.substr(0, index) + nextPlayer + position.substr(index + 1);
                    var over=this.gameOver(position);
                    if(over==0){
                        for(var i=0;i<9;i++){
                            if(position.charAt(i)=='0'){
                                position = position.substr(0, i) + '2' + position.substr(i + 1);
                                position = position.substr(0,9) + '1' + position.substr(9+ 1);
                                over=this.gameOver(position);
                                break;
                            }
                        }


                    }
                    var info="";
                    if(over!=0){
                        info="Koniec gry";
                    }
                    var playersOnMove=[];
                    playersOnMove.push(0);
                    callback({change:true,position:position,gameOver:over,info:info,playersOnMove:playersOnMove});
                }
                else{
                    callback({change:false});
                }

            }else{
                callback({change:false});
            }

        },
        gameOver:function (position){
            var i=0;
            var plansza=[];
            var rozmiar=9;

            for(i=0;i<rozmiar;i++){
                plansza[i]=position.charAt(i);
            }
            var koniec=0;
            for(var i=0;i<rozmiar;i=i+3){
                if(plansza[i]!=0){
                    if(plansza[i]==plansza[i+1]&&plansza[i]==plansza[i+2]){
                        koniec=plansza[i];
                    }
                }
            }
            for(var i=0;i<3;i++){
                if(plansza[i]!=0){
                    if(plansza[i]==plansza[i+3]&&plansza[i]==plansza[i+6]){
                        koniec=plansza[i];
                    }
                }
            }
            if(plansza[4]!=0){
                if(plansza[0]==plansza[4]&&plansza[0]==plansza[8]){
                    koniec=plansza[4];
                }
                else if(plansza[2]==plansza[4]&&plansza[2]==plansza[6]){
                    koniec=plansza[4];
                }
            }
            var full=true;
            if(koniec==0){
                for(var i=0;i<rozmiar;i++){
                    if(plansza[i]=='0'){
                        full=false;
                    }
                }
            }
            if(full){
                return 'X';
            }
            return koniec;
        }
    },
    '5':{
        startPosition:function(){return "00000000000000000000000001";},
        startInfo:function(){return "";},
        firstUsersOnMove:function(){return [0]},
        numberOfPlayers:function(){return 3},
        playerTimeout:function(position,i,callback){

            callback({change:true,position:position,gameOver:1,info:'Koniec gry',playersOnMove:[]});
        },
        makeMove:function(move,nrPlayer,position,callback){
            console.log(move);
            nrPlayer++;
            var turn=position.charAt(25);
            if(nrPlayer==turn)
            {
                if(position.charAt(move)=='0') {
                    var index=move;
                    position =this.positionAfterMove(move,position,turn);
                    console.log(position);
                    var over=this.gameOver(position);
                    var info="";
                    if(over!=0){
                        info="Koniec gry";
                    }
                    if(turn==2)
                        turn=3;
                    else if(turn==3)
                        turn=1;
                    else turn=2
                    var playersOnMove=[];
                    playersOnMove.push(turn-1);
                    callback({change:true,position:position,gameOver:over,info:info,playersOnMove:playersOnMove});
                }
                else{
                    callback({change:false});
                }

            }else{
                callback({change:false});
            }

        },
        gameOver:function (position){
            var plansza=[];
            var rozmiar=25;

            for(var i=0;i<rozmiar;i++){
                plansza[i]=position.charAt(i);
            }
            var koniec=0;
            var full=true;
            if(koniec==0){
                for(var i=0;i<rozmiar;i++){
                    if(plansza[i]=='0'){
                        full=false;
                    }
                }
            }
            if(full){
                return 'X';
            }
            return koniec;
        },positionAfterMove:function (move,position,turn) {
            console.log("cos");
            var plansza=[];
            var rozmiar=25;
            move=parseInt(move);
            for(var i=0;i<rozmiar;i++){
                plansza[i]=position.charAt(i);
            }
            plansza[move]=turn;
            var newPosition="";
            for(var i=0;i<rozmiar;i++){

                newPosition+=plansza[i]+"";
            }
            if(turn==2)
                turn=3;
            else if(turn==3)
                turn=1;
            else turn=2
            newPosition+=turn;
            console.log(newPosition);
            return newPosition;
        }
    },
    '6':{
        startPosition:function(){
            var Chess = require('chess.js').Chess;
            var chess = new Chess();


            return chess.fen();},
        startInfo:function(){return "";},
        firstUsersOnMove:function(){return [0]},
        numberOfPlayers:function(){return 2},
        playerTimeout:function(position,i,callback){

            callback({change:true,position:position,gameOver:1,info:'Koniec gry',playersOnMove:[]});
        },
        makeMove:function(move,nrPlayer,position,callback){
            var Chess = require('chess.js').Chess;
            var chess = new Chess();
            chess.load(position);
            var turn=chess.turn()=='w'?0:1;
            if(turn==nrPlayer){
                var m=chess.move(move);
                if(m!=null){
                    var info="";
                    var gOver=chess.game_over()?1:0;
                    turn=chess.turn()=='w'?0:1;
                    console.log(chess.fen());
                    callback({change:true,position:chess.fen(),gameOver:gOver,info:info,playersOnMove:[turn]});
                }else
                    callback({change:false});


            }
            else{

                callback({change:false});
            }


        }
    },
    '7':{
        startPosition:function(){
            var Chess = require('chess.js').Chess;
            var chess = new Chess();


            return chess.fen()+"&1&";},
        startInfo:function(){return "";},
        firstUsersOnMove:function(){return [0]},
        numberOfPlayers:function(){return 2},
        playerTimeout:function(position,i,callback){

            callback({change:true,position:position,gameOver:1,info:'Koniec gry',playersOnMove:[]});
        },
        makeMove:function(moves,nrPlayer,data,callback){
            var Chess = require('chess.js').Chess;
            var chess = new Chess();
            var tab=data.split("&");
            var position=tab[0];
            var numMoves=tab[1];
            var notation=tab[2]+numMoves+". ";
            chess.load(position);
            var turn=chess.turn()=='w'?0:1;
            if(turn==nrPlayer&&moves.length<=numMoves){
                var gOver=0;
                var info="";
                for(var i=0;i<moves.length;i++){
                    var m=chess.move(moves[i]);
                    notation+=(chess.history()[0])+' ';
                    if(m!=null){
                        gOver=chess.game_over()==true?1:0;
                        if(gOver==1||chess.in_check()||i==moves.length-1)break;
                        var tempFen=chess.fen().split(" ");
                        tempFen[1]=tempFen[1]=='w'?'b':'w';
                        tempFen[tempFen.length-3]="-";
                        var newFen="";
                        for(var j=0;j<tempFen.length;j++){
                            if(j>0)
                                newFen+=" ";
                            newFen+=tempFen[j];
                        }
                        chess.load(newFen);
                    }else {
                        callback({change: false});
                        return;
                    }
                }
                turn=chess.turn()=='w'?0:1;
                numMoves++;
                callback({change:true,position:chess.fen()+"&"+numMoves+'&'+notation,gameOver:gOver,info:info,playersOnMove:[turn]});
            }
            else{

                callback({change:false});
            }


        }
    },
    '8':{
        startPosition:function(){
            var Chess = require('chess.js').Chess;
            var chess = new Chess();


            return chess.fen()+'&'+0+'&';},
        startInfo:function(){return "";},
        firstUsersOnMove:function(){return [0]},
        numberOfPlayers:function(){return 4},
        playerTimeout:function(position,i,callback){

            callback({change:true,position:position,gameOver:1,info:'Koniec gry',playersOnMove:[]});
        },
        makeMove:function(move,nrPlayer,data,callback){
            var Chess = require('chess.js').Chess;
            var chess = new Chess();
            var tab=data.split("&");
            var playerOnMove=tab[1];
            var position=tab[0];
            chess.load(position);
            if(playerOnMove%2==0){
                var turn=chess.turn()=='w'?0:2;
                var chosenPiece=move['piece'];
                console.log(chosenPiece);
                if(turn==nrPlayer){
                    var possibleMoves=chess.moves({verbose:true})
                    for(var i=0;i<possibleMoves.length;i++){

                        if(possibleMoves[i]['piece']==chosenPiece){
                            turn++;
                            var res=chess.fen()+'&'+turn+'&'+chosenPiece;
                            callback({change:true,position:res,gameOver:0,info:'',playersOnMove:[turn]});
                            console.log('wynik');
                            return;
                        }
                    }

                }
                console.log("jestem tu");
                callback({change:false});

            }
            else{
               var pieceToMove= tab[2];
               var turn=chess.turn()=='w'?1:3;
               console.log(move);
               if(nrPlayer==turn){
                   if(chess.get(move['from'])['type']==pieceToMove){
                       var m=chess.move(move);
                       console.log(m);
                       if(m!=null){
                           var info="";
                           var gOver=chess.game_over()?1:0;
                           turn=turn==1?2:0;
                           var res=chess.fen()+'&'+turn+'&';
                           console.log(res);
                           callback({change:true,position:res,gameOver:gOver,info:info,playersOnMove:[turn]});
                           return;
                       }
                   }
               }
               callback({change:false});

            }
        }
    }
};