var board,
    g = new Chess(),
    statusEl,
    fenEl,
    pgnEl;
var moves=[];
var numMoves=1;
// do not pick up pieces if the game is over
// only pick up pieces for the side to move
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
    var move = g.move(m);

    // illegal move
    if (move === null) return 'snapback';
    else{
        moves.push(move);
        if(moves.length==numMoves||g.in_check()){
            game.move(moves);
            moves=[];

        }else{
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

    pgnEl.html(numMoves);
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
    load:function(data){
        var tab=data.split("&");
        numMoves=tab[1];
        fenEl.html(tab[2]);
        g.load(tab[0]);
        board.position(g.fen());
        updateStatus();
    },layout:function(){
        return "<link rel=\"stylesheet\" href=\"stylesheets/chessboard.css\" />" +
            "<div id=\"board1\" style=\"width: 400px\"></div>\n" +
            "<p>Status: <span id=\"status\"></span></p>\n" +
            "<p>Notation: <span id=\"fen\" '></span></p>\n" +
            "<p>Number of moves: <span id=\"pgn\"></span></p>";
    },rotateBoardForPlayer:function(numberOfSeat){
        if(numberOfSeat==1){
            board.orientation('black');
        }else if(numberOfSeat==0)
            board.orientation('white');
    }
}