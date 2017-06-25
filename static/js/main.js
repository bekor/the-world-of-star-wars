function main(){
    $('#registrationModal').hide()
    $('#residentModal').hide()

    $('.modal').on('hidden.bs.modal', function(){
        $('input').text("")
        $('#residenceBody').html("")
    })

    $('#registrationButton').click(function() {
        $('#registrationModal').modal('show')
    });

    initEvenetHandlers('#buttonRegist', '/registration', () => {location.href = "/list"})
    initEvenetHandlers('#navLogout', '/logout', () => {location.href = "/"})
    initEvenetHandlers('#navSignIn', '/login', (result) => {
        if(result.status == 'OK'){
            location.href = "/list"
        } else {
            location.href = "/"
    }})
}

function initEvenetHandlers(element, urlFor, success){
    $(element).click(function(){
        $.ajax({
            dataType: "json",
            url: urlFor,
            type: 'POST',
            data: $('form').serialize(),
            success: success,
            error: function(error){
                console.log(error)
            }
        });
    });
}

function numberFormat(number, decimals, decPoint, thousandsSep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
    var n = !isFinite(+number) ? 0 : +number
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    var s = ''
    var toFixedFix = function (n, prec) {
    var k = Math.pow(10, prec)
    return '' + (Math.round(n * k) / k)
        .toFixed(prec)
    }
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
}

$(document).ready(main)