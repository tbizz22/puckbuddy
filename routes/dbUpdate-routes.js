const db = require("../models");
var btoa = require('btoa');

// This calls my external API
var request = require('request');

//Get keys for sports feed 
require('dotenv').config()
const pbConfig = require('../config/puckbuddy.js');


// Set Key Values
const token = pbConfig.credentials.token;
const password = pbConfig.credentials.password;
const encode = btoa(token +":"+ password);
console.log(encode);
// get daily game schedule 
module.exports = function (app) {
    app.get("/api/UpdateSchedule", function (req, res) {
        var date = pbConfig.dates.Date;
        var season = pbConfig.dates.Season;
        var url = "https://api.mysportsfeeds.com/v2.0/pull/nhl/"
        var qURL = url + season + "/date/" + date + "/games.json";

        var options = {
            url: qURL,
            headers: {
                "Authorization": "Basic " + encode
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                console.log(info);
              
            } else {
                console.log(error);
                console.log(response.statusCode);
            }
        };

        request(options, callback);
    })

};