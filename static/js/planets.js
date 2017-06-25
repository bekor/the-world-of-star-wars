function planets(planetUrl){
    sessionStorage.setItem('planetUrl', planetUrl)
    var userName = $('#planet').data('usersession').toString();
    if( userName.length > 1){
        getVotes(userName)
    }
    getPlanets();

}

function getVotes(userName){
    $.getJSON('/' + userName + '/voted-planets', function(response){
        sessionStorage.setItem('votedPlanets', response.planets)
    })
}


function getPlanets(){
    planetUrl = sessionStorage.getItem('planetUrl')
    var planetResults
    $.ajax({
        dataType: "json",
        url: planetUrl,
        success: function (response) {
            getPlanetsCallback(response)
        },
        fail: function(data, status){
            console.log(status)
        }
    });
}

function getPlanetsCallback(response){
    generateButtons(response.next, response.previous)
    generatePlanets(response.results)
}

function generateButtons(next, prev){
    $('#previousPage').prop('disabled', true)
    $('#nextPage').prop('disabled', true)
    
    if(prev !== null){
        $('#previousPage').attr('data-url', prev).prop('disabled', false)
    }
    if(next !== null){
        $('#nextPage').attr('data-url', next).prop('disabled', false)
    }
}

function generatePlanets(planetsArray){
    planetAttrsName = ['name', 'diameter', 
                       'climate', 'terrain',
                       'surface_water', 'population',
                       'residents'];
    var votedPlanets = sessionStorage.getItem('votedPlanets')
    votedPlanets = votedPlanets.split(',')
    for(let i = 0; i < planetsArray.length; i++){
        formattedAttr = formatPlanetAttr(planetsArray[i])
        generatePlanetRow(formattedAttr, planetAttrsName, votedPlanets)
    }
}

function formatPlanetAttr(planetsArray){
    planetsArray.diameter = numberFormat(planetsArray.diameter) + " km"
    planetsArray.population = numberFormat(planetsArray.population) + " people"
    if(planetsArray.surface_water !== 'unknown'){
        planetsArray.surface_water = planetsArray.surface_water + " %"
    }
    return planetsArray
}


function registVote(planetId, username){
    $.post("/planetvote", { planetid: planetId, username: username})
        .done(function(data){
            alert("Vote accepted")
        });
}

function generatePlanetRow(planetAttribute, attributeNames, votedPlanets) {
    var planetHtmlId = planetAttribute.name.slice(0,2) + planetAttribute.orbital_period
    var planetUrlId = planetAttribute.url.slice(28, -1)
    
    let generateRow = $('<tr>').attr('id', planetHtmlId).attr('data-generated', true)
    $(generateRow).appendTo('tbody');
    for(let i = 0; i< attributeNames.length; i++) {
        let palnetAtr;
        if(i == attributeNames.length-1) {
            let residents = planetAttribute[attributeNames[i]]
            var resAttr = valueResidtensButton(residents) 
            if(resAttr.peopleId.length > 0){  
                palnetAtr = $(generateRow)
                                    .append($('<td>')
                                        .append($('<button>')
                                            .attr('class', 'btn btn-primary residentsButton')
                                            .attr('data-residence', planetAttribute.name)
                                            .attr('data-peopleId', resAttr.peopleId)
                                            .text(resAttr.text)
                                        ).addClass('text-center')
                                    )
            } else {
                palnetAtr = $(generateRow)
                                    .append($('<td>').text(resAttr.text).addClass('text-center'))
            }
            $(palnetAtr).appendTo(generateRow)
        } else {
            palnetAtr = $(generateRow)
                                .append($('<td>').text(planetAttribute[attributeNames[i]]).addClass('text-center'))
            $(palnetAtr).appendTo(generateRow)
        }
    }
    var userSession = $('#planet').data('usersession').toString()
    planetUrlId = planetUrlId + ""
    if(userSession.length > 1 && $.inArray(planetUrlId, votedPlanets) == -1){
        var generateVoteRow = $('<tr>').append($('<td>').append($('<button>')
                                        .attr('class', 'btn btn-block btn-warning voteButton')
                                        .attr('data-planetId', planetUrlId)
                                        .text('Vote for ' + planetAttribute.name)
                                        ).attr("colspan", "100%")
                                    ).addClass('text-center')
        generateRow.after($(generateVoteRow))
    }
}

function valueResidtensButton(residents){
    let residentText, peopleId = []
    if(residents.length<1) {
        residentText = 'Not known residents'
    } else {
        residentText = residents.length + ' residents'
        for(let j = 0; j < residents.length; j++){
            peopleId.push(residents[j])
        }
    }
    return {
        text: residentText,
        peopleId: peopleId
    }
}


$(document).ready(() => {
    planets('http://swapi.co/api/planets')

    $(document).on('click', '.voteButton', function(event) {
        $(this).parent().hide()
        var votedPlanetId = $(this).attr('data-planetId')
        var username = $('#planet').data('usersession').toString()
        registVote(votedPlanetId, username)
    })

    $('.changePageButton').on('click', function(event) {
        var pageUrl = $(this).attr('data-url')
        $('#planet').html("")
        planets(pageUrl)
    })
})