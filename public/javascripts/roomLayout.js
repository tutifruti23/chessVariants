window.addEventListener("load",function(){
    document.getElementById("changeToUsersList").addEventListener("click",function(){
        document.getElementById("availableUsers").style.cssText="display:block";
        document.getElementById("chat").style.cssText="display:none";
        this.classList.add("disabled");
        document.getElementById("changeToChat").classList.remove("disabled");

    });
    document.getElementById("changeToChat").addEventListener("click",function(){
        document.getElementById("availableUsers").style.cssText="display:none";
        document.getElementById("chat").style.cssText="display:block";
        this.classList.add("disabled");
        document.getElementById("changeToUsersList").classList.remove("disabled");
    });
});