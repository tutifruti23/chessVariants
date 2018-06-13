var game={
    initGame:function () {
        $(".pole").each(function(index){
            $(this).on("click",function(){
                game.move(index);
            });
        });
    },
    move:function(index){
        makeMove(index);
    },
    playersOnMove:function(position){
        return [position.charAt(36)-1];
    },
    load:function(position){
        $(".pole").each(function(i){
            if(position.charAt(i)=='1'){
                $(this).html('O');
            }
            else if(position.charAt(i)=='2'){
                $(this).html('X');
            }
            else{
                $(this).html('');
            }

        });
    },layout:function(){
        return "<table>\n" +
            "\t\t\t<tr>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t   <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t</tr>\n" +
            "\t\t\t<tr>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t   <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t</tr>\n" +
            "\t\t\t<tr>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t   <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t</tr>\n" +
            "\t\t\t<tr>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t   <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t</tr>\n" +
            "\t\t\t<tr>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t   <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t</tr>\n" +
            "\t\t\t<tr>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t   <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t  <td class=\"pole\"></td>\n" +
            "\t\t\t</tr>\n" +
            "\t\t  </table>";

    },rotateBoardForPlayer:function(numberOfSeat){

    }
}