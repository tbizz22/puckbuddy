
// handlebars helper functions
const Handlebars = require("handlebars");
Handlebars.registerHelper("firstLine", function(line, option) {
if (line == option) {
    return "Line One"
}
}) 





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
            if (!error && response.statusCode === 200) {
                var mod = JSON.parse(body);

                var game = setGame(mod);
                var ht = setHt(mod);
                var at = setAt(mod);

                res.render("game", {
                    game: game,
                    ht: ht,
                    at: at
                });

            } else {
                console.log(error);
                console.log(response.statusCode);
            }
        }


        request(options, callback);

    })



}


function setGame(fullObject) {
    var fullObj = fullObject;

    gObj = {};

    return gObj

}


function setHt(fullObject) {
    var fullObj = fullObject;
    var htObj = {};

    // add player references
    var ref = fullObject.references.playerReferences;
    // htObj.ref = ref;

    // get player lineup
    var linesFeed = fullObject.teamLineups[1].expected.lineupPositions;

    // this is where processed players will be pushed
    var lines = [];

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
        var playerID = 1




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
        } else {
            line = "";
        }

        // determine position
        var posData = position.split("-");
        console.log(posData)
        if (isGoalie === true) {
            pos = posData[1];
            line = posData[1];
        } else {
            pos = posData[1];
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
            }
        }





        //    add players to object
        var posDataCurrIterator = new PositionData(playerType, line, pos, playerID, isForward, isDefense, isGoalie)
        var playerDataCurrIterator = new PlayerData(id, firstName, lastName, officialPosition, jerseyNumber)


        var tempObj = {};
        tempObj.positionData = posDataCurrIterator;
        tempObj.playerdata = playerDataCurrIterator;

        lines.push(tempObj);
        htObj.lines = lines;



    }









    console.log((htObj));
    return htObj;
}


function setAt(fullObject) {
    var fullObj = fullObject;

}


function getLogo(teamId) {
    var path = pbConfig.teams[teamId]
    return path;
}


function PositionData(playerType, line, position, id, isForward, isDefense, isGoalie) {
    this.playerType = playerType,
    this.line = line,
    this.position = position
    this.id = id
    this.isForward = isForward
    this.isDefense = isDefense
    this.isGoalie = isGoalie
};


function PlayerData(id, firstName, lastName, officialPosition, jerseyNumber) {
    this.id = id,
        this.firstName = firstName,
        this.lastName = lastName,
        this.position = officialPosition,
        this.jerseyNumber = jerseyNumber

    // "lastName": "Anderson",
    // "position": "G",
    // "jerseyNumber": 41,
    // "currentTeam": {
    //     "id": 13,
    //     "abbreviation": "OTT"
    // },
    // "currentRosterStatus": "ROSTER",
    // "currentInjury": null,
    // "height": "6'2\"",
    // "weight": 187,
    // "birthDate": "1981-05-21",
    // "age": 37,
    // "birthCity": "Park Ridge, IL",
    // "birthCountry": "USA",
    // "rookie": false,
    // "college": null,
    // "twitter": "CraigAnderson41",
};