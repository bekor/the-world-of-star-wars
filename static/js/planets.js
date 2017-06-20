function planets(){
    getPlanets();

}

function getPlanets(){
    var planetResults;
    $.ajax({
        dataType: "json",
        url: "http://swapi.co/api/planets",
        success: function (response) {
            getPlanetsCallback(response.results);
        },
        fail: function(data, status){
            console.log(status)
        }
    });
    return planetResults;
}

function getPlanetsCallback(planetsArray){
    planetAttrsName = ['name', 'diameter', 
                       'climate', 'terrain',
                       'surface_water', 'population',
                       'residents'];
    for(let i = 0; i < planetsArray.length; i++){
        generatePlanetRow(planetsArray[i], planetAttrsName);
    }
}

function generatePlanetRow(planetAttribute, attributeNames) {
    var planetHtmlId = planetAttribute.name.slice(0,2) + planetAttribute.orbital_period;
    let generateRow = $('<tr>').attr('id', planetHtmlId);
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

planets();