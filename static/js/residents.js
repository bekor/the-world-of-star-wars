function residents(){
    var residentArray, residenceName;
    $(document).on('click', '.residentsButton', function(event) {
        $('#residenceTitle').text("");

        residentArray = $(this).data('peopleid').split(",");
        residenceName = $(this).data('residence');
        $('#residenceTitle').text("Residents of " + residenceName);

        people(residentArray, residenceName);
        $('#residentModal').modal('show');
    });

}

function people(residenceArray){
    residLeng = residenceArray.length
    if(residLeng > 0){
        for(let i = 0; i < residLeng; i++){
            getPersonAttr(residenceArray[i]);
        }
    } else {
        console.log("Something went wrong" + residenceArray);
    }
}

function getPersonAttr(personRout){
    $.getJSON(personRout, function(response){
        getPersonCallback(response);
    })
}

function getPersonCallback(personObj){
    personAttrsName = ['name', 'height', 
                       'mass', 'skin_color',
                       'hair_color', 'eye_color',
                       'birth_year', 'gender'];
    generateResidentsRow(personObj, personAttrsName);
}

function generateResidentsRow(personObj, personAttrsName){
    var personHtmlId = "person" + personObj.url.slice(27,-1);
    let generateRow = $('<tr>').attr('id', personHtmlId);
    $(generateRow).appendTo('#residenceBody');
    for(let i = 0; i< personAttrsName.length; i++) {
        var personCol; 
        var personAttr = personObj[personAttrsName[i]];
        personCol = $(generateRow)
                            .append($('<td>')
                                .text(personAttr)
                            );
        $(personCol).appendTo(generateRow);
    }
}

residents();