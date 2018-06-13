const $configTextarea = $('#config-textarea');
const $saveConfigButton = $('#save-config-button');
const $gameDetails = $('#game-details');
const $submitGrantAdmin = $('#submit-grant-admin');
const $submitRevokeAdmin = $('#submit-revoke-admin');
const $grantAdminForm = $('#grant-admin-form');
const $revokeAdminForm = $('#revoke-admin-form');
const $activateButton = $('#activate-button');
const $gameTitle = $('#game-title');
const $addButton = $('#add-button');
const $newGameDesc = $('#new-game-desc');
const $newGameName = $('#new-game-name');
const $deleteButton = $('#delete-button');
const $updateGameDesc = $('#update-game-desc');
const $updateGameButton = $('#update-game-button');
const $updateGameName = $('#update-game-name');



$(function () {
    var id= null;
    var active = false;
    var actualGameDetails = null;

    if(id==null){
        $gameDetails.hide();
    }

    $('.gamesList li').click(function() {
        id = this.id.replace ( /[^\d.]/g, '' );
        console.log(id);
        $.get('/cms/getconfig',{id:id}, function (data) {
            actualGameDetails = JSON.parse(data);
            console.log(actualGameDetails);
            let str = JSON.stringify(actualGameDetails.config, null, 2);
            $configTextarea.val(str);
            if(actualGameDetails.active == true){
                $activateButton.text("Deactivate Game");
            }else{
                $activateButton.text("Activate Game");
            }
            $gameTitle.text(actualGameDetails.name);
            $updateGameName.val(actualGameDetails.name);
            $updateGameDesc.val(actualGameDetails.description);
            $gameDetails.show();
        });

    });

    $saveConfigButton.click(function () {
        console.log('isValid: ',isValidJSON($configTextarea.val()));
        if(isValidJSON($configTextarea.val())) {
            let idcopy = id;
            console.log({id: idcopy, config: $configTextarea.val()})
            $.post('/cms/saveconfig', {id: id, config: $configTextarea.val()}, function (result) {
                if(!result){
                    alert("Config nie jest w prawidłowym formacie JSON!");
                }
                console.log('save config : ', result);
            });
        }else{
            alert("Config nie jest w prawidłowym formacie JSON!");
        }
    });

    $submitGrantAdmin.click(function () {
        let data = getFormData($grantAdminForm);
        console.log(data);
        $.post('/cms/grantadmin',data, function (result) {
            console.log('/grantadmin ',result);

        });
        return false;
    });

    $submitRevokeAdmin.click(function () {
        let data = getFormData($revokeAdminForm);
        console.log(data);
        $.post('/cms/revokeadmin',data, function (result) {
            console.log('/revokeadmin ',result);

        });
        return false;
    });

    $activateButton.click(function () {
        let data = {
          id:id,
          active:!actualGameDetails.active
        };
        actualGameDetails.active = !actualGameDetails.active;
        $.post('/cms/changegameactivity',data,function(result)  {
           console.log(result);
           if(actualGameDetails.active == true){
               $activateButton.text("Deactivate Game");
           }else{
               $activateButton.text("Activate Game");
           }
        });
    });

    $addButton.click(function () {
        let data ={
            name: $newGameName.val(),
            description: $newGameDesc.val()
        };
        console.log(data)
        $.post('/cms/addnewgame',data,function (result) {
            if(result){
                $newGameDesc.val("");
                $newGameName.val("");
                window.location.reload(true);
            }
        });
    });

    $deleteButton.click(function () {
       $.get('/cms/deletegame',{id:id},function (res) {
           window.location.reload(true);
       });
    });

    $updateGameButton.click(function () {
        let data ={
            id:id,
            name: $updateGameName.val(),
            description: $updateGameDesc.val()
        };
        console.log(data);
        $.post('/cms/updategame',data,function (result) {
            if(result){
                $updateGameDesc.val('');
                $updateGameName.val('');
                window.location.reload(true);
            }
        });

    });
});

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function isValidJSON(json) {
    try{
        JSON.parse(json);
        return true;
    }catch(e){
        return false;
    }
}