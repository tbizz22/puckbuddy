module.exports = function(sequelize, DataTypes) {
    var Team = sequelize.define("Team", {
        Name: DataTypes.STRING,
        Abvr: DataTypes.STRING,
        GamesPlayed: DataTypes.INTEGER,
        Wins: DataTypes.INTEGER,
        Losses: DataTypes.INTEGER,
        OtWins: DataTypes.INTEGER,
        ExtTeamID: DataTypes.INTEGER,
    });
    return Team;
};