
function main(){
    $('#registrationModal').hide();
    $('#residentModal').hide();

    $('.modal').on('hidden.bs.modal', function(){
        $('input').text("");
        $('#residenceBody').html("");
    })

    $('#registrationButton').click(function() {
        $('#registrationModal').modal('show');
    });

}

$(document).ready(main)