var board,
    g = new Chess(),
    statusEl,
    fenEl,
    pgnEl,
    tempChess=new Chess();
;

// do not pick up pieces if the game is over
// only pick up pieces for the side to move
function knightOwnCapture(source,target){

    const targetSquare=g.get(target);
    const sourceSquare=g.get(source);
    if(targetSquare==null||sourceSquare==null||targetSquare.color!=sourceSquare.color)
        return false;
    const colDiff=Math.abs(target.charCodeAt(0)-source.charCodeAt(0));
    const rowDiff=Math.abs(parseInt(target.charAt(1))-parseInt(source.charAt(1)));
    return (colDiff+rowDiff==3&&colDiff>0&&rowDiff>0);
}
function rookOwnCapture(source,target,piece){
    const colDiff=(target.charCodeAt(0)-source.charCodeAt(0));
    const rowDiff=(parseInt(target.charAt(1))-parseInt(source.charAt(1)));
    if(colDiff==0||rowDiff==0){
        const dist=Math.abs(colDiff)>Math.abs(rowDiff)?colDiff:rowDiff;
        if(dist!=0){
            const targetSquare=g.get(target);
            const sourceSquare=g.get(source);
            console.log(sourceSquare);
            if(targetSquare==null||sourceSquare==null||targetSquare.color!=sourceSquare.color||sourceSquare.type!=piece)
                return false;
            if(Math.abs(dist)==1){
                return true;
            }else{
                var avMoves=g.moves({square:source,verbose:true});
                const srcNum=parseInt(source.charAt(1));
                var squareToCheck;
                if(colDiff==0){
                    const letter=source.charAt(0);
                    const number=srcNum+dist+(dist>0?(-1):1);
                    squareToCheck=letter+''+number;
                }else{
                    const srcLetterAscii=source.charCodeAt(0);
                    const letterToCheckAscii=srcLetterAscii+dist+(dist>0?(-1):1);
                    squareToCheck=String.fromCharCode(letterToCheckAscii)+''+srcNum;
                }
                if(avMoves.find(x=>x.to==squareToCheck)){
                    return true;
                }
            }
        }
    }
    return false;
}
function bishopOwnCapture(source,target,piece){
    const colDiff=(target.charCodeAt(0)-source.charCodeAt(0));
    const rowDiff=(parseInt(target.charAt(1))-parseInt(source.charAt(1)));
    if(colDiff!=0&&rowDiff!=0&&Math.abs(colDiff)==Math.abs(rowDiff)){
        const dist=colDiff+rowDiff;
        const targetSquare=g.get(target);
        const sourceSquare=g.get(source);
        if(targetSquare==null||sourceSquare==null||targetSquare.color!=sourceSquare.color||sourceSquare.type!=piece)
            return false;

        if(Math.abs(colDiff)==1||Math.abs(rowDiff)==1){
            var absDist=Math.abs(dist);
            if(absDist==2||absDist==0)
                return true;

        }else{
            var avMoves=g.moves({square:source,verbose:true});
            const srcNum=parseInt(source.charAt(1));
            var squareToCheck;
            const number=srcNum+rowDiff+(rowDiff>0?(-1):1);
            const srcLetterAscii=source.charCodeAt(0);
            const letterToCheckAscii=srcLetterAscii+colDiff+(colDiff>0?(-1):1);
            squareToCheck=String.fromCharCode(letterToCheckAscii)+''+number;
            if(avMoves.find(x=>x.to==squareToCheck)){
                return true;
            }
        }
    }
    return false;
}
function queenOwnCapture(source,target,piece){
    return bishopOwnCapture(source,target,piece)||rookOwnCapture(source,target,piece);
}
function kingOwnCapture(source,target,piece){
    const colDiff=(target.charCodeAt(0)-source.charCodeAt(0));
    const rowDiff=(parseInt(target.charAt(1))-parseInt(source.charAt(1)));
    if(Math.abs(colDiff)<=1&&Math.abs(rowDiff)<=1){
        if(colDiff==0&&rowDiff==0)
            return false;
        const targetSquare=g.get(target);
        const sourceSquare=g.get(source);
        return targetSquare!=null&&sourceSquare!=null&&targetSquare.color==sourceSquare.color&&sourceSquare.type==piece;
    }
    return false;
}
function pawnOwnCapture(source,target,piece){
    const colDiff=(target.charCodeAt(0)-source.charCodeAt(0));
    const rowDiff=(parseInt(target.charAt(1))-parseInt(source.charAt(1)));
    const targetSquare=g.get(target);
    const sourceSquare=g.get(source);
    if(targetSquare==null||sourceSquare==null||targetSquare.color!=sourceSquare.color||sourceSquare.type!=piece)
        return false;
    if(sourceSquare.color=='w'){
        if(rowDiff==1&&Math.abs(colDiff)==1)
            return true;
    }else{
        if(rowDiff==(-1)&&Math.abs(colDiff)==1)
            return true;
    }
    return false;
}
function ownCapture(source,target){
    var goodCapture;
    const sourceSquare=g.get(source);
    const targetSquare=g.get(target);
    var piece=sourceSquare.type;

    if(targetSquare==null||sourceSquare==null||(targetSquare.type=='p'&&(source.charAt(1)=='1'||source.charAt(1)=='8')))
        piece='';
    switch (piece){
        case 'p':{
            goodCapture=pawnOwnCapture(source,target,piece);
            break;
        }case 'n':{
        goodCapture=knightOwnCapture(source,target,piece);
        break;
    }case 'b':{
        goodCapture=bishopOwnCapture(source,target,piece);
        break;
    }case 'r':{
        goodCapture=rookOwnCapture(source,target,piece);
        break;
    }case 'q':{
        goodCapture=queenOwnCapture(source,target,piece);
        break;
    }case 'k':{
        goodCapture=kingOwnCapture(source,target,piece);
        break;
    }default:
        goodCapture=false;
    }

    if(goodCapture){

        tempChess.load(g.fen());
        var sourcePiece=tempChess.remove(source);
        if(sourcePiece.type=='p'&&(target.charAt(1)=='1'||target.charAt(1)=='8'))
            sourcePiece.type='q';
        var targetPiece=tempChess.remove(target);
        tempChess.put(targetPiece,source);
        tempChess.put(sourcePiece,target);

        if(tempChess.in_check()){
            goodCapture=false;
        }else{
            g.load(tempChess.fen());
            var tempFen=g.fen().split(" ");
            tempFen[1]=tempFen[1]=='w'?'b':'w';
            tempFen[tempFen.length-3]="-";
            var newFen="";
            for(var i=0;i<tempFen.length;i++){
                if(i>0)
                    newFen+=" ";
                newFen+=tempFen[i];
            }
            g.load(newFen);
        }
    }
    return goodCapture;
}
var onDragStart = function(source, piece, position, orientation) {

    var czyNaRuchu=true;
    angular.element('[ng-controller=table]').scope().$apply(function(scope){
        var turn=g.turn()=='w'?'0':'1';
        if(scope.table['seat'+turn]!==userId||scope.table['inProgress']=='0') {
            czyNaRuchu = false;
        }
    });
    if(!czyNaRuchu)
        return false;
    if (g.game_over() === true ||
        (g.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (g.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
};

var onDrop = function(source, target) {
    // see if the move is legal
    var m={
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    };

    if(!ownCapture(source,target)){
        var move = g.move(m);


        // illegal move
        if (move === null) return 'snapback';
        else{
            game.move(move);
            updateStatus();
        }


    }else{
        makeMove(m);
        updateStatus();
    }

};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
    board.position(g.fen());
};

var updateStatus = function() {
    var status = '';

    var moveColor = 'White';
    if (g.turn() === 'b') {
        moveColor = 'Black';
    }

    // checkmate?
    if (g.in_checkmate() === true) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    }

    // draw?
    else if (g.in_draw() === true) {
        status = 'Game over, drawn position';
    }

    // game still on
    else {
        status = moveColor + ' to move';

        // check?
        if (g.in_check() === true) {
            status += ', ' + moveColor + ' is in check';
        }
    }

    statusEl.html(status);
    fenEl.html(g.fen());
    pgnEl.html(g.pgn());
};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};



var game={

    initGame:function () {
        board = ChessBoard('board1', cfg);
        statusEl = $('#status'),
            fenEl = $('#fen'),
            pgnEl = $('#pgn');
        updateStatus();
    },
    move:function(move){
        makeMove(move);
    },
    playersOnMove:function(position){
        return g.turn()=='w'?[0]:[1];
    },
    load:function(position){
        g.load(position);
        board.position(g.fen());
        updateStatus();
    },layout:function(){
        return "<link rel=\"stylesheet\" href=\"stylesheets/chessboard.css\" />" +
            "<div class='container'>" +
            "   <div class='row'>" +
                "<div id='board1' style='width: 400px'></div>" +
                "</div>" +
            "   <div class='row'>" +
                        "<p>Status: <span id='status'></span></p>" +
            "   </div>" +
            "</div>";

            ;
    },rotateBoardForPlayer:function(numberOfSeat){
        if(numberOfSeat==1){
            board.orientation('black');
        }else if(numberOfSeat==0)
            board.orientation('white');
   }
}