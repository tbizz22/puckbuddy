const db = require("../models");
var btoa = require('btoa');

// This calls my external API
var request = require('request');


//Get keys for sports feed 
require('dotenv').config()
const pbConfig = require('../config/puckbuddy.js');
// Set Key Values

console.log(pbConfig.credentials.token)
const token = pbConfig.credentials.token;
const password = pbConfig.credentials.password;
const encode = btoa(token + password);


// get daily game schedule 

module.exports = function (app) {
    app.get("/api/UpdateSchedule", function (req, res) {
        var date = pbConfig.dates.Date;
        var season = pbConfig.dates.Season;
        var url = "https://api.mysportsfeeds.com/v1.2/pull/nhl/"
        var qURL1 = url + season + "/daily_game_schedule.json?fordate=" + date;
        var qURL = "https://api.mysportsfeeds.com/v2.0/pull/nhl/2018-2019-regular/date/20190316/games.json"

        var options = {
            url: qURL,
            headers: {
                "Authorization": "Basic " + encode
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                console.log(info.stargazers_count + " Stars");
                console.log(info.forks_count + " Forks");
            }
        };


        request(options, callback);
    })

};