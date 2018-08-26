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
        var split = id.split("-")
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
                playerFullStats = response.data;
            }).then(function () {
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
            console.log(qURL)
            if (!error && response.statusCode === 200) {
                var mod = JSON.parse(body);
                var pfs = playerFullStats
                // var game = setGame(mod.game);
                var ht = setTeam(mod, 1, pfs);
                var at = setTeam(mod, 0, pfs);

                res.render("game", {
                    ht: ht,
                    at: at,
                    layout:"game-layout"
                });

            } else {
                console.log(error);
                console.log(response.statusCode);
                res.render("404")
            }
        }


    })
}




function setTeam(fullObject, team, pfs) {
    var fullObj = fullObject;
    var tObj = {};
    var playerFullStats = pfs;

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




    // enrich player position data

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
        if (player == null) {
            playerID = null
        } else {
            playerID = player.id
        }

        // enrich player object

        for (var p = 0; p < playerFullStats.players.length; p++) {
            var pfsCurr = playerFullStats.players[p].player
            if (pfsCurr.id === playerID) {                
                var id = pfsCurr.id;
                var firstName = pfsCurr.firstName;
                var lastName = pfsCurr.lastName;
                var officialPosition = pfsCurr.primaryPosition;
                var jerseyNumber = pfsCurr.jerseyNumber;
                var currentInjury = pfsCurr.currentInjury;
                var height = pfsCurr.height;
                var weight = pfsCurr.weight;
                var birthDate = pfsCurr.birthDate;
                var age = pfsCurr.age;
                var birthCity = pfsCurr.birthCity;
                var birthCountry = pfsCurr.birthCountry;
                var rookie = pfsCurr.rookie;
                var college = pfsCurr.college;
                var twitter = pfsCurr.twitter;
                var handedness = pfsCurr.handedness;
                var officialImageSrc = pfsCurr.officialImageSrc;
                var socialMediaAccount = setSocialMedia(pfsCurr)
                
                function  setSocialMedia(pfsCurr) {
                    if (pfsCurr.socialMediaAccounts.length == 0) {
                        return null
                    } else {
                        console.log(pfsCurr.socialMediaAccounts[0].value)
                        return pfsCurr.socialMediaAccounts[0].value
                    }
                };
                var seasonStartYear = function (pfsCurr) {
                    if (pfsCurr.currentContractYear.seasonStartYear == null) {
                        return "2017"
                    } else {
                        return pfsCurr.currentContractYear.seasonStartYear
                    }
                };
                var baseSalary = function (pfsCurr) {
                    if (pfsCurr.currentContractYear.baseSalary == null) {
                        return "0"
                    } else {
                        return pfsCurr.currentContractYear.baseSalary
                    }
                };
                var minorsSalary = function (pfsCurr) {
                    if (pfsCurr.currentContractYear.minorsSalary == null) {
                        return "0"
                    } else {
                        return pfsCurr.currentContractYear.minorsSalary
                    }
                };
                var signingBonus = function (pfsCurr) {
                    if (pfsCurr.currentContractYear.signingBonus == null) {
                        return "0"
                    } else {
                        return pfsCurr.currentContractYear.signingBonus
                    }
                };
                var otherBonuses = function (pfsCurr) {
                    if (pfsCurr.currentContractYear.otherBonuses == null) {
                        return "0"
                    } else {
                        return pfsCurr.currentContractYear.otherBonuses;
                    }
                };
                
                var capHit = function (pfsCurr) {
                    if (pfsCurr.currentContractYear.capHit == null) {
                        return "0"
                    } else {
                        return pfsCurr.currentContractYear.capHit;
                    }
                };
                var fullNoTradeClause = function (pfsCurr) {
                    if (pfsCurr.currentContractYear.fullNoTradeClause == null) {
                        return "0"
                    } else {
                        return pfsCurr.currentContractYear.fullNoTradeClause;
                    }
                };
                var modifiedNoTradeClause = function (pfsCurr) {
                    if (pfsCurr.currentContractYear.modifiedNoTradeClause == null) {
                        return "0"
                    } else {
                        return pfsCurr.currentContractYear.modifiedNoTradeClause;
                    }
                };
                var noMovementClause = function (pfsCurr) {
                    if (pfsCurr.currentContractYear.noMovementClause == null) {
                        return "0"
                    } else {
                        return pfsCurr.currentContractYear.noMovementClause;
                    }
                };
                var overallTotalYears = function (pfsCurr) {
                    if (pfsCurr.currentContractYear.overallContract.overallTotalYears == null) {
                        return "0"
                    } else {
                        return pfsCurr.currentContractYear.overallContract.overallTotalYearss;
                    }
                };
                var overallTotalSalary = function (pfsCurr) {
                    if (pfsCurr.currentContractYear.overallContract.overallTotalSalary == null) {
                        return "0"
                    } else {
                        return pfsCurr.currentContractYear.overallContract.overallTotalSalary;
                    }
                };
                var overallTotalBonuses = function (pfsCurr) {
                    if (pfsCurr.currentContractYear.overallContract.overallTotalBonuses == null) {
                        return "0"
                    } else {
                        return pfsCurr.currentContractYear.overallContract.overallTotalBonuses;
                    }
                };
                var overallExpiryStatus = function (pfsCurr) {
                    if (pfsCurr.currentContractYear.overallContract.overallExpiryStatus == null) {
                        return "0"
                    } else {
                        return pfsCurr.currentContractYear.overallContract.overallExpiryStatus;
                    }
                };
                var overallAnnualAverageSalary = function (pfsCurr) {
                    if (pfsCurr.currentContractYear.overallContract.overallAnnualAverageSalary == null) {
                        return "0"
                    } else {
                        return pfsCurr.currentContractYear.overallContract.overallAnnualAverageSalary;
                    }
                };
                var draftYear = function (pfsCurr) {
                    if (pfsCurr.drafted.year == null) {
                        return "Undrafted"
                    } else {
                        return pfsCurr.drafted.year;
                    }
                };
                var draftTeam = function (pfsCurr) {
                    if (pfsCurr.drafted.team.id == null) {
                        return "Undrafted"
                    } else {
                        return pfsCurr.drafted.team.id;
                    }
                };
                var draftRound = function (pfsCurr) {
                    if (pfsCurr.drafted.round == null) {
                        return "Undrafted"
                    } else {
                        return pfsCurr.drafted.round;
                    }
                };
                var draftPick = function (pfsCurr) {
                    if (pfsCurr.drafted.roundPick == null) {
                        return "Undrafted"
                    } else {
                        return pfsCurr.drafted.roundPick;
                    }
                };
                var draftOverall = function(pfsCurr) {
                    if (pfsCurr.drafted == null) {
                        return null
                    } else {
                        return pfsCurr.drafted.overallPick;
                    }
                };
                var extPlayerID = function (pfsCurr) {
                    if (pfsCurr.externalMappings[0].id == null) {
                        return "Missing Data"
                    } else {
                        return pfsCurr.externalMappings[0].id;
                    }
                }
            }
        }



        //    add players to object
        var posDataCurrIterator = new PositionData(playerType, line, pos, playerID, isForward, isDefense, isGoalie, isLine1, isLine2, isLine3, isLine4, isLw, isC, isRw, isLd, isRd, isSg, isBg)
        var playerDataCurrIterator = new PlayerData(id, firstName, lastName, officialPosition, jerseyNumber, currentInjury, height, weight, birthDate, age, birthCity, birthCountry, rookie, college, twitter, handedness, officialImageSrc,
            socialMediaAccount, seasonStartYear, baseSalary, minorsSalary, signingBonus, otherBonuses, capHit, fullNoTradeClause, modifiedNoTradeClause, noMovementClause, overallTotalYears, overallTotalSalary, overallTotalBonuses,
            overallExpiryStatus, overallAnnualAverageSalary, draftYear, draftTeam, draftRound, draftPick, draftOverall, extPlayerID)


        var tempObj = {};
        tempObj.positionData = posDataCurrIterator;
        tempObj.playerData = playerDataCurrIterator;
        console.log(playerDataCurrIterator)
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


function PlayerData(id, firstName, lastName, officialPosition, jerseyNumber, currentInjury, height, weight, birthDate, age, birthCity, birthCountry, rookie, college, twitter, handedness, officialImageSrc,
    socialMediaAccount, seasonStartYear, baseSalary, minorsSalary, signingBonus, otherBonuses, capHit, fullNoTradeClause, modifiedNoTradeClause, noMovementClause, overallTotalYears, overallTotalSalary, overallTotalBonuses,
    overallExpiryStatus, overallAnnualAverageSalary, draftYear, draftTeam, draftRound, draftPick, draftOverall, extPlayerID) {
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
        this.handedness = handedness,
        this.officialImageSrc = officialImageSrc,
        this.socialMediaAccount = socialMediaAccount,

        this.seasonStartYear = seasonStartYear,
        this.baseSalary = baseSalary,
        this.minorsSalary = minorsSalary,
        this.signingBonus = signingBonus,
        this.otherBonuses = otherBonuses,
        this.capHit = capHit,
        this.fullNoTradeClause = fullNoTradeClause,
        this.modifiedNoTradeClause = modifiedNoTradeClause,
        this.noMovementClause = noMovementClause,

        this.overallTotalYears = overallTotalYears,
        this.overallTotalSalary = overallTotalSalary,
        this.overallTotalBonuses = overallTotalBonuses,
        this.overallExpiryStatus = overallExpiryStatus,
        this.overallAnnualAverageSalary = overallAnnualAverageSalary,

        this.draftYear = draftYear,
        this.draftTeam = draftTeam,
        this.draftRound = draftRound,
        this.draftPick = draftPick,
        this.draftOverall = draftOverall,

        this.extPlayerID = extPlayerID

}
