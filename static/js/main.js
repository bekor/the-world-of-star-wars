
function main(){
    $('#registrationModal').hide();
    $('#residentModal').hide();

    $('.modal').on('hidden.bs.modal', function(){
        $('input').text("");
        $('#residenceBody').html("");
    })

    userRegistration();
    userSignIn();
    userLogOut();
}

function userRegistration(){
    $('#registrationButton').click(function() {
        $('#registrationModal').modal('show');
    });

    $('#buttonRegist').click(function(){
        $.ajax({
            dataType: "json",
            url: '/registration',
            type: 'POST',
            data: $('form').serialize(),
            success: function(result){
                location.href = "/list"
            },
            error: function(error){
                console.log(error)
            }
        });
    });
}

function userLogOut(){
    $('#navLogout').click(function(){
        $.ajax({
            dataType: "json",
            url: '/logout',
            type: 'POST',
            data: $('#activeUser').text(),
            success: function(result){
                location.href = "/"
            },
            error: function(error){
                console.log(error)
            }
        });
    });
}

function userSignIn(){
    $('#navSignIn').click(function(){
        $.ajax({
            dataType: "json",
            url: '/login',
            type: 'POST',
            data: $('form').serialize(),
            success: function(result){
                if(result.status == 'OK'){
                    location.href = "/list"
                } else {
                    location.href = "/"
                }
            },
            error: function(error){
                console.log(error)
            }
        });
    });
}

$(document).ready(main)