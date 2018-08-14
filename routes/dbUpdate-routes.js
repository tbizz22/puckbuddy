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
const encode = btoa(token + ":" + password);
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

                var sched = JSON.parse(body);

                for (var i = 0; i < sched.games.length; i++) {

                    var homeID = sched.games[i].schedule.homeTeam.id;
                    var homeAbbrv = sched.games[i].schedule.homeTeam.abbreviation;
                    var awayID = sched.games[i].schedule.awayTeam.id;
                    var awayAbbrv = sched.games[i].schedule.awayTeam.abbreviation;
                    var arena = sched.games[i].schedule.venue.name;
                    var startTime = sched.games[i].schedule.startTime;
                    var ExtgameIDString = date + "-" + awayAbbrv + "-" + homeAbbrv;
                    var ExtID = sched.games[i].schedule.id;
                    var PlayedStatus = sched.games[i].schedule.playedStatus;



                    db.Game.create({
                        StartTime: startTime,
                        Venue: arena,
                        HomeTeamID: homeID,
                        HomeAbvr: homeAbbrv,
                        AwayTeamID: awayID,
                        AwayAbvr: awayAbbrv,
                        PlayedStatus: PlayedStatus,
                        ExtGameIDString: ExtgameIDString,
                        ExtID: ExtID
                    }).then(function (game) {
                        res.json(game);
                    }).catch(function (err) {
                        res.json(err)
                    });
                }


            } else {
                console.log(error);
                console.log(response.statusCode);
            }
        };

        request(options, callback);
    })

};