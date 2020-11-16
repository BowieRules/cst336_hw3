window.onload = function(){
    resetFeedback();
    $("#search").on("click", doSearch);
};

// variables for user input fields
var zipCode;
var radius;

// read input, initiate search
function doSearch(){
    zipCode = $("#zip").val();
    radius = $("#radius").val();
    if (isValid())
    {
        resetFeedback();
        getData();
    }
}

// get data and build results
async function getData(){
    var apiKey = "qapDVIl1RrWwJ9hGkB3evT2ZtEgOZcRck37aylMX";
    var url = "https://api.data.gov/ed/collegescorecard/v1/schools.json?_zip=" + zipCode + "&_distance=" + radius + "mi&_per_page=100&fields=school.ownership,school.name,school.state,school.city,school.degrees_awarded.highest,school.school_url&api_key=" + apiKey;
    var type = "public";
    // TODO
    if(type != "public"){
        url += "&minmagnitude="+ magnitude;
    }

    let response = await fetch(url);
    let data = await response.json();

    var results = data.results;
    var colList = "";
    for(let i = 0; i < results.length; i++){
        var ownership = "";
        var schoolName = results[i]["school.name"];
        var city = results[i]["school.city"];
        var url = results[i]["school.school_url"];
        var state =  results[i]["school.state"];
        var highestdegree = "";
        switch(results[i]["school.degrees_awarded.highest"]) {
          case 0:
            highestdegree = "Non-degree-granting school.";
            break;
          case 1:
            highestdegree = "Most awards earned are certificates, but degrees may be offered.";
            break;
          case 2:
            highestdegree = "Most awards earned are 2-year associate's degrees, but other degrees and certificates may be offered.";
            break;
          case 3:
            highestdegree = "Most awards earned are 4-year bachelor's degrees, but other degrees and certificates may be offered.";
            break;
          case 4:
            highestdegree = "Most awards earned are graduate degrees, but other degrees and certificates may be offered.";
            break;
        }
        switch(results[i]["school.ownership"]) {
          case 1:
            ownership = "Public";
            break;
          case 2:
            ownership = "Private nonprofit";
            break;
          case 3:
            ownership = "Private for-profit";
            break;
        }
        colList += '<div class="card right_box" style="width: 20rem;">' +
                    '<div class="card-body">' +
                     '<h5 class="card-title">' + schoolName + '</h5>' +
                     '<h6 class="card-subtitle mb-2 text-muted">' + city + ', ' + state +'</h6>' +
                     '<p class="card-text"><ul class="no-bullets"><li>'+ ownership + '</li><li>'+ highestdegree + '</li></ul></p>' +
                     '<a href="' + url + '" class="card-link">' + url + '</a>' +
                    '</div>' +
                  '</div>';
    }
    var alert = results.length + ' colleges returned';
    $("#alert").html(alert);
    $("#alert").show();
    $("#output").html(colList);
}

// clear out all validators
function resetFeedback(){
    $("#alert").hide();
    $("#radiusError").hide();
    $("#zipError").hide();
    $("#output").html("");
}

// check for required fields
function isValid(){
    var isValid = true;
    if($.trim(zipCode) == "") {
        isValid = false;
        $("#zipError").html("ZipCode is required");
        $("#zipError").show();
    }
    else {
      $("#zipError").hide();
    }
    if($.trim(radius) == "") {

        isValid = false;
        $("#radiusError").html("Select distance radius");
        $("#radiusError").show();
    }
    else {
      $("#radiusError").hide();
    }
    return isValid;
}
