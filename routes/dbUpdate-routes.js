const db = require("../models");
const btoa = require('btoa');

// This calls my external API
var request = require('request');

// get moment libary
const moment = require("moment");

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
                var resJson = [];
                for (var i = 0; i < sched.games.length; i++) {

                    var homeID = sched.games[i].schedule.homeTeam.id;
                    var homeAbbrv = sched.games[i].schedule.homeTeam.abbreviation;
                    var awayID = sched.games[i].schedule.awayTeam.id;
                    var awayAbbrv = sched.games[i].schedule.awayTeam.abbreviation;
                    var arena = sched.games[i].schedule.venue.name;
                    var startTime = sched.games[i].schedule.startTime;
                    var gameDate = moment.utc(startTime).format("YYYYMMDD");
                    var ExtgameIDString = date + "-" + awayAbbrv + "-" + homeAbbrv;
                    var ExtID = sched.games[i].schedule.id;
                    var PlayedStatus = sched.games[i].schedule.playedStatus;


                    db.Game.create({
                        StartTime: startTime,
                        GameDate: gameDate,
                        Venue: arena,
                        HomeTeamID: homeID,
                        HomeAbvr: homeAbbrv,
                        AwayTeamID: awayID,
                        AwayAbvr: awayAbbrv,
                        PlayedStatus: PlayedStatus,
                        ExtGameIDString: ExtgameIDString,
                        ExtID: ExtID
                    }).then(function (game) {
                        resJson.push(game);
                    }).catch(function (err) {
                        res.json(err)
                    });
                }
                res.json(resJson);

            } else {
                console.log(error);
                console.log(response.statusCode);
            }
        };

        request(options, callback);
    });

    app.get("/api/UpdateTeams", function (req, res) {
        var date = pbConfig.dates.Date;
        var season = pbConfig.dates.Season;
        var url = "https://api.mysportsfeeds.com/v2.0/pull/nhl/"
        var qURL = url + season + "/team_stats_totals.json";

        var options = {
            url: qURL,
            headers: {
                "Authorization": "Basic " + encode
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)

                var teamsRes = JSON.parse(body);
                var resJson = [];
                for (var i = 0; i < teamsRes.teamStatsTotals.length; i++) {

                    var name = teamsRes.teamStatsTotals[i].team.name;
                    var city = teamsRes.teamStatsTotals[i].team.city;
                    var abvr = teamsRes.teamStatsTotals[i].team.abbreviation;
                    var gamesPlayed = teamsRes.teamStatsTotals[i].stats.gamesPlayed;
                    var wins = teamsRes.teamStatsTotals[i].stats.standings.wins;
                    var losses = teamsRes.teamStatsTotals[i].stats.standings.losses;
                    var otWins = teamsRes.teamStatsTotals[i].stats.standings.overtimeWins;
                    var otLosses = teamsRes.teamStatsTotals[i].stats.standings.overtimeLosses;
                    var points = teamsRes.teamStatsTotals[i].stats.standings.points;


                    var extTeamID = teamsRes.teamStatsTotals[i].team.id;
                    var teamColoursHex = teamsRes.teamStatsTotals[i].team.teamColoursHex[0];
                    var socialMediaAccounts = teamsRes.teamStatsTotals[i].team.socialMediaAccounts[0];
                    var officialLogoImageSrc = teamsRes.teamStatsTotals[i].team.officialLogoImageSrc;


                    var faceoffWins = teamsRes.teamStatsTotals[i].stats.faceoffs.faceoffWins;
                    var faceoffLosses = teamsRes.teamStatsTotals[i].stats.faceoffs.faceoffLosses;
                    var faceoffPercent = teamsRes.teamStatsTotals[i].stats.faceoffs.faceoffPercent;


                    var powerplays = teamsRes.teamStatsTotals[i].stats.powerplay.powerplays;
                    var powerplayGoals = teamsRes.teamStatsTotals[i].stats.powerplay.powerplayGoals;
                    var powerplayPercent = teamsRes.teamStatsTotals[i].stats.powerplay.powerplayPercent;
                    var penaltyKills = teamsRes.teamStatsTotals[i].stats.powerplay.penaltyKills;
                    var penaltyKillGoalsAllowed = teamsRes.teamStatsTotals[i].stats.powerplay.penaltyKillGoalsAllowed;
                    var penaltyKillPercent = teamsRes.teamStatsTotals[i].stats.powerplay.penaltyKillPercent;


                    var goalsFor = teamsRes.teamStatsTotals[i].stats.miscellaneous.goalsFor;
                    var goalsAgainst = teamsRes.teamStatsTotals[i].stats.miscellaneous.goalsAgainst;
                    var shots = teamsRes.teamStatsTotals[i].stats.miscellaneous.shots;
                    var blockedShots = teamsRes.teamStatsTotals[i].stats.miscellaneous.blockedShots;
                    var penalties = teamsRes.teamStatsTotals[i].stats.miscellaneous.penalties;
                    var penaltyMinutes = teamsRes.teamStatsTotals[i].stats.miscellaneous.penaltyMinutes;
                    var hits = teamsRes.teamStatsTotals[i].stats.miscellaneous.hits;


                    db.Team.create({
                        name: name,
                        city: city,
                        abvr: abvr,
                        gamesPlayed: gamesPlayed,
                        wins: wins,
                        losses: losses,
                        otWins: otWins,
                        otLosses: otLosses,
                        points: points,
                        extTeamID: extTeamID,
                        teamColoursHex: teamColoursHex,
                        socialMediaAccounts: socialMediaAccounts,
                        officialLogoImageSrc: officialLogoImageSrc,
                        faceoffWins: faceoffWins,
                        faceoffLosses: faceoffLosses,
                        faceoffPercent: faceoffPercent,
                        powerplays: powerplays,
                        powerplayGoals: powerplayGoals,
                        powerplayPercent: powerplayPercent,
                        penaltyKills: penaltyKills,
                        penaltyKillGoalsAllowed: penaltyKillGoalsAllowed,
                        penaltyKillPercent: penaltyKillPercent,
                        goalsFor: goalsFor,
                        goalsAgainst: goalsAgainst,
                        shots: shots,
                        blockedShots: blockedShots,
                        penalties: penalties,
                        penaltyMinutes: penaltyMinutes,
                        hits: hits
                    }).then(function (team) {
                        resJson.push(team);
                    }).catch(function (err) {
                        res.json(err)
                    });
                }
                res.json(resJson);

            } else {
                console.log(error);
                console.log(response.statusCode);
            }
        };

        request(options, callback);
    });
}