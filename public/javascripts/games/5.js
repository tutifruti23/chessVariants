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
        return [position.charAt(25)-1];
    },
    load:function(position){
        $(".pole").each(function(i){
            if(position.charAt(i)=='0'){
                $(this).html('');
            }
            else if(position.charAt(i)=='1'){
                $(this).html('O');
            }
            else if(position.charAt(i)=='2'){
                $(this).html('P');
            }
            else{
                $(this).html('X');
            }

        });
    },layout:function(){
        return "<table>\n" +
            "            <tr>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            <td class=\"pole\"></td>\n" +
            "            </tr>\n" +
            "            </table>";
    }
}