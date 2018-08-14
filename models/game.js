module.exports = function(sequelize, DataTypes) {
    var Game = sequelize.define("Game", {
        StartTime: DataTypes.STRING,
        Venue: DataTypes.STRING,
        HomeTeamID: DataTypes.INTEGER,
        HomeAbvr: DataTypes.STRING,
        AwayTeamID: DataTypes.INTEGER,
        AwayAbvr: DataTypes.STRING,
        PlayedStatus: DataTypes.STRING,
        ExtGameIDString: DataTypes.STRING,
        ExtID: DataTypes.INTEGER
    });

    return Game;
};