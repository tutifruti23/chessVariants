const PASSWORD_LENGTH_ERR = 'Password must be longer than 6 characters!';
const PASSWORDS_NOT_EQUAL = 'Passwords are not equal!';
const PASSWORD_LENGTH = 6;

const $allGames = $('#all-games');
const submitRegisterButton = $('#submit-register');

var auth2;
window.onbeforeunload = function(e){
    gapi.auth2.getAuthInstance().signOut();
};
$(function () {

    gapi.load('auth2', function() {
        gapi.auth2.init();
        auth2 = gapi.auth2.getAuthInstance();
    });

    var id=null;
    $('.all-games, [id^=game]').click(function() {
        id = this.id.replace ( /[^\d.]/g, '' );
        console.log(id);
        $.get('/games/checkiflogged', function (result) {
            if(result) {
                var params = {gameId:id};
                let query = $.param(params);
                console.log(query)
                window.location.href = '/room?'+query;
            }else {
                alert("prosze się zalogować przed dołączeniem do stołu");
            }
        });

    });

    $('#submit-login').click(function () {
        var data = getFormData($('#login-form'));
        console.log(validateEmail(data.email) && data.password.length>=PASSWORD_LENGTH);
        if(validateEmail(data.email) && data.password.length>=PASSWORD_LENGTH) {
            $.post('/login/logindata', data, function (response) {
                if (response.isValid) {
                    window.location.href = '../room';
                    console.log("isValid, ",response.name)
                } else {
                    console.log("not Valid, ", response.name)
                }
            });
        }
        return false;
    });

    submitRegisterButton.click(function () {
        var data = getFormData($('#register-form'));
        console.log(data);
        if (data.password == data.passwordConfirm && data.password.length >= PASSWORD_LENGTH) {
            $.post('/login/register', data, function (response) {
                if (response.isValid) {
                    alert("Witaj " + response.name);
                } else {
                    //TODO
                    alert("Spróbuj ponownie, niepoprawny adres e-mail lub hasło")
                }
            });
        } else if (data.password.length < PASSWORD_LENGTH) {
            console.log($('#password-error').length);
            if ($('#password-error').length < 1) {
                $('<p id = "password-error" class = "mt-3">' + PASSWORD_LENGTH_ERR + '</p>').insertAfter(submitRegisterButton);
            } else if ($('#password-error').val() != PASSWORD_LENGTH_ERR) {
                $('#password-error').text(PASSWORD_LENGTH_ERR);
            }
        } else if (data.password != data.passwordConfirm) {
            console.log('ds');
            if ($('#password-error').length < 1) {
                $('<p id = "password-error" class = "mt-3">' + PASSWORDS_NOT_EQUAL + '</p>').insertAfter(submitRegisterButton);
            } else if ($('#password-error').val() != PASSWORDS_NOT_EQUAL) {
                $('#password-error').text(PASSWORDS_NOT_EQUAL);
            }
        }
        return false;
    });

    if(getCookie('username')){
        $('#logLink').hide();
        $('#logoutLink').show();
    }

});

function onSignIn(googleUser) {
    /*var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); */// This is null if the 'email' scope is not present.
    let idToken = googleUser.getAuthResponse().id_token;
    $.post('/login/googleLogin', {idToken:idToken}, function (response) {
        if(response)
            window.location.replace("../room");
    });

}

function signOut() {
    console.log('xd')
    auth2.signOut().then(function () {
        console.log('User signed out.');
        window.location.href ='../logout'
    });
}

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}