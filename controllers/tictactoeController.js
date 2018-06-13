exports.makeMove=function(move,nrPlayer,position,callback){
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
            var over=gameOver(position);
            var info="";
            if(over!=0){
                info="Koniec gry";
            }
            var playersOnMove=[];
            playersOnMove.push(nextPlayer);
            callback({change:true,position:position,gameOver:over,info:info,playersOnMove:playersOnMove});
        }
        else{
            callback({change:false});
        }

    }else{
        callback({change:false});
    }

};
var gameData=require('../models/gameData');



/*exports.gameController=function(callback){gameData.configs(function(data){
    callback (data)})};
*/


