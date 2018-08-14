// api-routes.js

var db = require("../models");


module.exports = function (app) {
    app.get("/games"),
        function (req, res) {
            db.Games.findAll({}).then(function (games) {
                console.log(games);
            })
        }

};