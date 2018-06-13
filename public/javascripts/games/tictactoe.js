var gracz=1;
var koniecGry=false;
var plansza=[];
var rozmiar=9;
var winner=0;
var ktoryGracz=-1;
function pelnaPlansza(){
    for(var i=0;i<rozmiar;i++){
        if(plansza[i]==0)
            return false;
    }

    return true;
}

function sprawdzCzyKoniec(){
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
    return koniec;

}



