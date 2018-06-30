var board,
    g = new Chess(),
    statusEl,
    fenEl,
    pgnEl;
var numMoves=1;
// do not pick up pieces if the game is over
// only pick up pieces for the side to move
var onDragStart = function(source, piece, position, orientation) {

    var czyNaRuchu=true;
    angular.element('[ng-controller=table]').scope().$apply(function(scope){
        var turn=scope.table['position'].split('&')[1];
        if(scope.table['seat'+turn]!=userId||scope.table['inProgress']=='0') {
            czyNaRuchu = false;
        }
        if(turn%2==0){
            czyNaRuchu = false;
        }
        var pieceToMove=scope.table['position'].split('&')[2];
        if(piece.toLowerCase().charAt(1)!=pieceToMove){
            czyNaRuchu=false;
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
        game.move(move);
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
        $('.pieceChosen').each(function(){
            var value=$(this).val();
            $(this).on("click",function(){
                game.move({piece:value});
            });

        });
        updateStatus();
    },
    move:function(move){
        makeMove(move);
    },
    playersOnMove:function(position){
        return [position.split('&')[1]];
    },
    load:function(data){
        var tab=data.split("&");
        numMoves=tab[1];
        fenEl.html(tab[2]);
        g.load(tab[0]);
        board.position(g.fen());
        if(tab[1]!=null){
            var turn=parseInt(tab[1]);
            var playerChoosePieceTurn=turn%2==0;

            $(".pieceChosen").each(function(){

                if(playerChoosePieceTurn){
                    $(this).removeClass('disabled')
                }else{
                    $(this).addClass('disabled');
                }

            });
        }
        var $pieceImage=$('#pieceImage');
        if(tab[2]!=''){
            var color=g.turn();
            var piece=tab[2].toUpperCase();

            $pieceImage.html('<img src="img/chesspieces/wikipedia/'+color+piece+'.png"/>')
        }else{
            $pieceImage.html('');
        }
        updateStatus();
    },layout:function(){
        return "<link rel=\"stylesheet\" href=\"stylesheets/chessboard.css\" />" +

            "<div class='container noPaddingNoMargin'>"+
                "<div class='row noPaddingNoMargin'>" +
                "   <div class='col-2 noPaddingNoMargin' style='border:1px solid gray;height:80px'>" +
                "       <div id='pieceImage' ></div>" +
                "   </div> " +
                    "<div class='col-md-10 col-sm-12'>" +
                         "<div id='board1' style='width: 400px'></div> " +
                    " </div>"+
                "</div>"+
            "</div>"+
            "<div  class='container' id='piecesToChoose' style='display:none;'>" +
            "   <div class='row' >" +
            "       <div class='col-2 noPaddingNoMargin'>" +
            "         <button value='p' class='pieceChosen btn noPaddingNoMargin btn-primary btn-sm btn-block'>p</button>" +
            "       </div>" +
            "       <div class='col-2 noPaddingNoMargin'>" +
            "           <button value='n' class='pieceChosen noPaddingNoMargin btn btn-primary btn-sm btn-block'>n</button>" +
            "       </div>" +
            "       <div class='col-2 noPaddingNoMargin'>" +
            "           <button value='b' class='pieceChosen btn noPaddingNoMargin btn-primary btn-sm btn-block'>b</button>" +
            "       </div>" +
            "       <div class='col-2 noPaddingNoMargin'>" +
            "           <button value='r' class='pieceChosen btn noPaddingNoMargin btn-primary btn-sm btn-block'>r</button>" +
            "       </div>" +
            "       <div class='col-2 noPaddingNoMargin'>" +
            "           <button value='q' class='pieceChosen btn noPaddingNoMargin btn-primary btn-sm btn-block'>q</button>" +
            "       </div>" +
            "       <div class='col-2 noPaddingNoMargin'>" +
            "           <button value='k' class='pieceChosen btn noPaddingNoMargin btn-primary btn-sm btn-block'>k</button>" +
            "       </div>" +
            "   </div>" +
            "</div>"+
            "<div class='container'>"+
                "<p>Status: <span id=\"status\"></span></p>\n" +
                "<p>Notation: <span id=\"fen\"></span></p>\n" +
                "<p>Number of moves: <span id=\"pgn\"></span></p>"+
            "</div>"
            ;

    },rotateBoardForPlayer:function(numberOfSeat){
        if(numberOfSeat==2||numberOfSeat==3){
            board.orientation('black');
        }else if(numberOfSeat==0||numberOfSeat==1)
            board.orientation('white');
        if(numberOfSeat==0||numberOfSeat==2){
            document.getElementById('piecesToChoose').style.display='initial';
        }else{
            document.getElementById('piecesToChoose').style.display='none';
        }
    }
}