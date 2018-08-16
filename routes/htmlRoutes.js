// htmlRoutes.js


const db = require("../models");
const pbConfig = require('../config/puckbuddy.js');
const moment = require("moment");

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
}



function getLogo(teamId) {
    var path = pbConfig.teams[teamId]    
    return path;
}