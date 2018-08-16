// htmlRoutes.js

const btoa = require('btoa');
const db = require("../models");
const pbConfig = require('../config/puckbuddy.js');
const moment = require("moment");
const request = require("request");


// Set Key Values
const token = pbConfig.credentials.token;
const password = pbConfig.credentials.password;
const encode = btoa(token + ":" + password);





// Routes

module.exports = function (app) {
    // Load index page

    app.get("/", function (req, res) {
        db.Game.findAll({
            where: {
                GameDate: pbConfig.dates.Date
            }
        }).then(function (schedObj) {
            var mod = schedObj    

            for (var i = 0; i < mod.length; i++) {
                var hTeam = getLogo(mod[i].dataValues.HomeTeamID)
                var aTeam = getLogo(mod[i].dataValues.AwayTeamID)  
                var localStartTime = mod[i].dataValues.StartTime;             

                mod[i].dataValues["LocalStartTime"] = moment(localStartTime).format("LT");
                mod[i].dataValues["HTlogoPath"] = hTeam;
                mod[i].dataValues["ATlogoPath"] = aTeam;
            };
            res.render("index", {
                schedule: mod
            });
        }).catch(function (err) {
            res.json(err);
        });
    });


    app.get("/game/:id", function (req, res) {
        
        // improvement is to get team stats from DB here. 
        
        
        

        // get player data direct from API        
        var id = req.params.id;
        var season = pbConfig.dates.Season;
        var url = "https://api.mysportsfeeds.com/v2.0/pull/nhl/"
        var qURL = url + season + "/games/" + id + "/lineup.json"
 
        var options = {
            url: qURL,
            headers: {
                "Authorization": "Basic " + encode
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode ==200) {
                console.log(body);


                res.render("game");
            } else {
                console.log(error);
                console.log(statusCode);
            }
        }
 

        request(options,callback);

    })



}




function getLogo(teamId) {
    var path = pbConfig.teams[teamId]    
    return path;
}