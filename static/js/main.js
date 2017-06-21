
function main(){
    $('#registrationModal').hide();
    $('#residentModal').hide();

    $('.modal').on('hidden.bs.modal', function(){
        $('input').text("");
        $('#residenceBody').html("");
    })

    $('#buttonRegist').click(function(){
        console.log($('form').serialize())
        $.ajax({
            dataType: "json",
            url: '/registration',
            type: 'POST',
            data: $('form').serialize(),
            success: function(result){
                console.log(result)
                location.href = "/list"
            },
            error: function(error){
                console.log(error)
            }
        });
    });

    $('#navSignIn').click(function(){
        $.ajax({
            dataType: "json",
            url: '/login',
            type: 'POST',
            data: $('form').serialize(),
            success: function(result){
                console.log(result)
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

    $('#navLogout').click(function(){
        console.log("something")
        $.ajax({
            dataType: "json",
            url: '/logout',
            type: 'POST',
            data: $('#activeUser').text(),
            success: function(result){
                console.log(result);
                location.href = "/"
            },
            error: function(error){
                console.log(error)
            }
        });
    });

    $('#registrationButton').click(function() {
        $('#registrationModal').modal('show');
    });

}

$(document).ready(main)