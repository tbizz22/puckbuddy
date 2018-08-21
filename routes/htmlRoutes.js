// htmlRoutes.js
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const btoa = require('btoa');
const db = require("../models");
const pbConfig = require('../config/puckbuddy.js');
const moment = require("moment");
const request = require("request");


// Set Key Values
const token = pbConfig.credentials.token;
const password = pbConfig.credentials.password;
const encode = btoa(token + ":" + password);


// require
axios = require("axios");






// Routes

module.exports = function (app) {
    // Load index page

    app.get("/", function (req, res) {
        db.Game.findAll({
            where: {
                GameDate: pbConfig.dates.searchDate
            }
        }).then(function (schedObj) {
            console.log(schedObj)
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
        var split = id.split("")
        var season = pbConfig.dates.Season;
        var url = "https://api.mysportsfeeds.com/v2.0/pull/nhl/"
        var qURL = url + season + "/games/" + id + "/lineup.json"
        var fullPlyrObj = {}
        var playerUrl = "https://api.mysportsfeeds.com/v2.0/pull/nhl/players.json?team=" + split[1] + "," + split[2];
        var playerFullStats
        
        loadData()

        function loadData() {
            axios({
                method: 'get',
                url: playerUrl,
                headers: {
                    "Authorization": "Basic " + encode
                }
            }).then(function (response) {
                console.log(response);
                playerFullStats  = response.data                          
                console.log(JSON.stringify(playerFullStats))
            }).then(function () {
                console.log("made it here too")
                request(options, callback);
            })


        }

        var options = {
            url: qURL,
            headers: {
                "Authorization": "Basic " + encode
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode === 200) {
                var mod = JSON.parse(body);

                // var game = setGame(mod.game);
                var ht = setTeam(mod, 1);
                var at = setTeam(mod, 0);

                res.render("game", {
                    ht: ht,
                    at: at
                });

            } else {
                console.log(error);
                console.log(response.statusCode);
            }
        }


    })
}




function setTeam(fullObject, team) {
    var fullObj = fullObject;
    var tObj = {};
    // add player references
    var ref = fullObject.references.playerReferences;
    // tObj.ref = ref;

    // get player lineup
    var linesFeed = fullObject.teamLineups[team].expected.lineupPositions;

    // this is where processed players will be pushed
    var lines = [];


    // enhance object with team info

    var teamData = fullObject.references.teamReferences;


    if (team === 0) {
        for (var t = 0; t < teamData.length; t++) {
            if (teamData[t].id === fullObj.game.awayTeam.id) {
                currTeam = teamData[t]
            }
        }
    } else {
        for (var t = 0; t < teamData.length; t++) {
            if (teamData[t].id === fullObj.game.homeTeam.id) {
                currTeam = teamData[t]
            }
        }
    }

    tObj.team = currTeam;




    // enrich player data

    for (var i = 0; i < linesFeed.length; i++) {
        var player = linesFeed[i].player;
        var position = linesFeed[i].position;
        var line;
        var pos;
        var isDefense = false;
        var isGoalie = false;
        var isForward = false;
        var playerType;
        var playerID;
        var isLine1 = false;
        var isLine2 = false;
        var isLine3 = false;
        var isLine4 = false;
        var isLw = false;
        var isC = false;
        var isRw = false;
        var isLd = false;
        var isRd = false;
        var isSg = false;
        var isBg = false;




        // determine playertype
        if (position.indexOf("Forward") !== -1) {
            isForward = true;
            playerType = "forward"
        } else if (position.indexOf("Goalie") !== -1) {
            isGoalie = true;
            playerType = "goalie";
        } else {
            isDefense = true;
            playerType = "defense"
        };

        // determine line
        if (isForward === true || isDefense === true) {
            var lineData = position.match(/\d+/g).map(Number);
            line = lineData[0];

            if (line === 1) {
                isLine1 = true;
            } else if (line === 2) {
                isLine2 = true;
            } else if (line === 3) {
                isLine3 = true;
            } else if (line === 4) {
                isLine4 = true;
            }
        } else {
            line = "";
        }

        // determine position
        var posData = position.split("-");
        if (isGoalie === true) {
            pos = posData[1];
            line = posData[1];
            if (pos == "Starter") {
                isSg = true;
            } else if (pos == "Backup") {
                isBg = true;
            }

        } else {
            pos = posData[1];

            if (pos === "LW") {
                isLw = true;
            } else if (pos === "C") {
                isC = true;
            } else if (pos === "RW") {
                isRw = true;
            } else if (pos === "L") {
                isLd = true;
            } else if (pos === "R") {
                isRd = true;
            }
        }


        // set player id
        playerID = player.id

        // enrich player object

        for (var p = 0; p < ref.length; p++) {
            if (ref[p].id === playerID) {
                var id = ref[p].id
                var firstName = ref[p].firstName
                var lastName = ref[p].lastName
                var officialPosition = ref[p].primaryPosition
                var jerseyNumber = ref[p].jerseyNumber
                var currentInjury = ref[p].currentInjury
                var height = ref[p].height
                var weight = ref[p].weight
                var birthDate = ref[p].birthDate
                var age = ref[p].age
                var birthCity = ref[p].birthCity
                var birthCountry = ref[p].birthCountry
                var rookie = ref[p].rookie
                var college = ref[p].college
                var twitter = ref[p].twitter
                var handedness = ref[p].handedness.shoots
            }
        }

        //    add players to object
        var posDataCurrIterator = new PositionData(playerType, line, pos, playerID, isForward, isDefense, isGoalie, isLine1, isLine2, isLine3, isLine4, isLw, isC, isRw, isLd, isRd, isSg, isBg)
        var playerDataCurrIterator = new PlayerData(id, firstName, lastName, officialPosition, jerseyNumber, currentInjury, height, weight, birthDate, age, birthCity, birthCountry, rookie, college, twitter, handedness)


        var tempObj = {};
        tempObj.positionData = posDataCurrIterator;
        tempObj.playerData = playerDataCurrIterator;
        // console.log(playerDataCurrIterator)
        lines.push(tempObj);
        tObj.lines = lines;
    }

    return tObj;
}




function getLogo(teamId) {
    var path = pbConfig.teams[teamId]
    return path;
}


function PositionData(playerType, line, position, id, isForward, isDefense, isGoalie, isLine1, isLine2, isLine3, isLine4, isLw, isC, isRw, isLd, isRd, isSg, isBg) {
    this.playerType = playerType,
        this.line = line,
        this.position = position
    this.id = id
    this.isForward = isForward
    this.isDefense = isDefense
    this.isGoalie = isGoalie
    this.isLine1 = isLine1
    this.isLine2 = isLine2
    this.isLine3 = isLine3
    this.isLine4 = isLine4
    this.isLw = isLw
    this.isC = isC
    this.isRw = isRw
    this.isLd = isLd
    this.isRd = isRd
    this.isSg = isSg
    this.isBg = isBg
};


function PlayerData(id, firstName, lastName, officialPosition, jerseyNumber, currentInjury, height, weight, birthDate, age, birthCity, birthCountry, rookie, college, twitter, handedness) {
    this.id = id,
        this.firstName = firstName,
        this.lastName = lastName,
        this.position = officialPosition,
        this.jerseyNumber = jerseyNumber,
        this.currentInjury = currentInjury,
        this.height = height,
        this.weight = weight,
        this.birthDate = birthDate,
        this.age = age,
        this.birthCity = birthCity,
        this.birthCountry = birthCountry,
        this.rookie = rookie,
        this.college = college,
        this.twitter = twitter,
        this.handedness = handedness
};