function planets(planetUrl){
    planetUrl =  planetUrl !== 0 ? planetUrl : 'http://swapi.co/api/planets'
    sessionStorage.setItem('planetUrl', planetUrl)
    var userName = $('#planet').data('usersession').toString();
    if( userName.length > 1){
        getVotes(userName);
    } else {
        getPlanets(planetUrl);
    }

}

function getVotes(userName){
    $.getJSON('/' + userName + '/voted-planets', function(response){
        getVotedPlanetsCallback(response.planets, userName);
    })
}

function getVotedPlanetsCallback(votedPlanets, userName){
    sessionStorage.setItem('votedPlanets', votedPlanets)
    getPlanets();
}

function getPlanets(){
    planetUrl = sessionStorage.getItem('planetUrl')
    var planetResults;
    $.ajax({
        dataType: "json",
        url: planetUrl,
        success: function (response) {
            getPlanetsCallback(response);
        },
        fail: function(data, status){
            console.log(status)
        }
    });
    return planetResults;
}

function getPlanetsCallback(response){
    generateButtons(response.next, response.previous);
    generatePlanets(response.results);
}

function generateButtons(next, prev){
    $('#previousPage').prop('disabled', true)
    $('#nextPage').prop('disabled', true)
    if(prev !== null){
        $('#previousPage').attr('data-url', prev).prop('disabled', false);
    }
    if(next !== null){
        $('#nextPage').attr('data-url', next).prop('disabled', false);
    }

    $(document).on('click', '.changePageButton', function(event) {
        var pageUrl = $(this).attr('data-url');
        $('tbody').empty();
        planets(pageUrl)
    });
}

function generatePlanets(planetsArray){
    planetAttrsName = ['name', 'diameter', 
                       'climate', 'terrain',
                       'surface_water', 'population',
                       'residents'];
    var votedPlanets = sessionStorage.getItem('votedPlanets')
    for(let i = 0; i < planetsArray.length; i++){
        generatePlanetRow(planetsArray[i], planetAttrsName, votedPlanets);
    }

     $(document).on('click', '.voteButton', function(event) {
        $(this).parent().hide();
        var votedPlanetId = $(this).attr('data-planetId');
        var username = $('#planet').data('usersession').toString();
        registVote(votedPlanetId, username);
    });
}

function registVote(planetId, username){
    $.post("/planetvote", { planetid: planetId, username: username})
        .done(function(data){
            alert("Vote accepted")
        });
}

function generatePlanetRow(planetAttribute, attributeNames, votedPlanets) {
    var planetHtmlId = planetAttribute.name.slice(0,2) + planetAttribute.orbital_period;
    var planetUrlId = planetAttribute.url.slice(28, -1);
    
    let generateRow = $('<tr>').attr('id', planetHtmlId).attr('data-generated', true);
    $(generateRow).appendTo('tbody');
    for(let i = 0; i< attributeNames.length; i++) {
        let palnetAtr;
        if(i == attributeNames.length-1) {
            let residents = planetAttribute[attributeNames[i]];
            var resAttr = valueResidtensButton(residents) 
            if(resAttr.peopleId.length > 0){  
                palnetAtr = $(generateRow)
                                    .append($('<td>')
                                        .append($('<button>')
                                            .attr('class', 'residentsButton')
                                            .attr('data-residence', planetAttribute.name)
                                            .attr('data-peopleId', resAttr.peopleId)
                                            .text(resAttr.text)
                                        )
                                    );
            } else {
                palnetAtr = $(generateRow)
                                    .append($('<td>').text(resAttr.text));
            }
            $(palnetAtr).appendTo(generateRow);
        } else {
            palnetAtr = $(generateRow)
                                .append($('<td>').text(planetAttribute[attributeNames[i]]));
            $(palnetAtr).appendTo(generateRow);
        }
    }
    var userSession = $('#planet').data('usersession').toString();
    if(userSession.length > 1 && $.inArray(planetUrlId, votedPlanets)){
        var generateVoteRow = $('<tr>').append($('<button>')
                                        .attr('class', 'voteButton')
                                        .attr('data-planetId', planetUrlId)
                                        .text('Vote for ' + planetAttribute.name));
        generateRow.after($(generateVoteRow));
    }
}

function valueResidtensButton(residents){
    let residentText, peopleId = [];
    if(residents.length<1) {
        residentText = 'Not known residents';
    } else {
        residentText = residents.length + ' residents';
        for(let j = 0; j < residents.length; j++){
            peopleId.push(residents[j]);
        }
    }
    return {
        text: residentText,
        peopleId: peopleId
    };
}

planets(pageUrl=0);