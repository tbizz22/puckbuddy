module.exports = function (sequelize, DataTypes) {
    var Team = sequelize.define("Team", {
        city: DataTypes.STRING,
        name: DataTypes.STRING,
        abvr: DataTypes.STRING,
        gamesPlayed: DataTypes.INTEGER,
        wins: DataTypes.INTEGER,
        losses: DataTypes.INTEGER,
        otWins: DataTypes.INTEGER,
        otLosses: DataTypes.INTEGER,
        points: DataTypes.INTEGER,
        extTeamID: DataTypes.INTEGER,
        teamColoursHex: DataTypes.STRING,
        socialMediaAccounts: DataTypes.STRING,
        officialLogoImageSrc: DataTypes.STRING,
        faceoffWins: DataTypes.INTEGER,
        faceoffLosses: DataTypes.INTEGER,
        faceoffPercent: DataTypes.INTEGER,
        powerplays: DataTypes.INTEGER,
        powerplayGoals: DataTypes.INTEGER,
        powerplayPercent: DataTypes.INTEGER,
        penaltyKills: DataTypes.INTEGER,
        penaltyKillGoalsAllowed: DataTypes.INTEGER,
        penaltyKillPercent: DataTypes.INTEGER,
        goalsFor: DataTypes.INTEGER,
        goalsAgainst: DataTypes.INTEGER,
        shots: DataTypes.INTEGER,
        blockedShots: DataTypes.INTEGER,
        penalties: DataTypes.INTEGER,
        penaltyMinutes: DataTypes.INTEGER,
        hits: DataTypes.INTEGER
    });
    return Team;
};