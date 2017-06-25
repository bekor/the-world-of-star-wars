function voteStatistics(){
    var residentArray, residenceName
    $('#voteStatButton').on('click', function(event) {
        $('#voteStatModal').modal('show')
    });
    var username = $('#votes').data('usersession').toString()
    if(username.length > 1){
        $.getJSON('/list-of-voted-planets', function(response){
            let statistics = response.statistics
            for(let i = 0; i < statistics.length; i++){
                $.getJSON(statistics[i].planetUrl, function(swresponse){
                    planetName = swresponse.name
                    votes = statistics[i].votes
                    generateRow(planetName, votes)
                });
            }
        });
    }
}

function generateRow(planetName, votes){
    let generateRow = $('<tr>')
    $(generateRow).appendTo('#votes')
    $(generateRow).append($('<td>').text(planetName))
    $(generateRow).append($('<td>').text(votes))
}

$(document).ready(voteStatistics)