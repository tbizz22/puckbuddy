var request = require('request');




// Increment Date
UpdateSchedule();
UpdateTeams();


function UpdateSchedule() {
    request("https://puckbuddytwb.herokuapp.com/api/UpdateSchedule", function (error, response, body) {
        console.log("Error: " + error);
        console.log("Response: " + response);
        console.log("Body: " + body);
    })
};



function UpdateTeams() {
    request("https://puckbuddytwb.herokuapp.com/api/UpdateTeams", function (error, response, body) {
        console.log("Error: " + error);
        console.log("Response: " + response);
        console.log("Body: " + body);
    })
}

