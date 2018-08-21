const moment = require('moment');

var demoDate = "20180113"
var date = moment.utc(demoDate).format("YYYYMMDD")

const pb = {
    "credentials": {
        "token": process.env.TOKEN,
        "password": process.env.PASSWORD
    },
    "dates": {
        "Season": "2017-2018-regular",
        "Date": date,
        "searchDate": "20180114"
    },
    "teams": {
        29: "../images/ducks.gif",
        30: "../images/coyotes.gif",
        11: "../images/bruins.gif",
        15: "../images/sabres.gif",
        23: "../images/flames.gif",
        3: "../images/hurricanes.gif",
        20: "../images/blackhawks.gif",
        22: "../images/avalanche.gif",
        19: "../images/bluejackets.gif",
        27: "../images/stars.gif",
        16: "../images/redwings.gif",
        24: "../images/oilers.gif",
        4: "../images/panthers.gif",
        28: "../images/kings.gif",
        25: "../images/wild.gif",
        14: "../images/canadiens.gif",
        18: "../images/predators.gif",
        7: "../images/devils.gif",
        8: "../images/islanders.gif",
        9: "../images/rangers.gif",
        13: "../images/senators.gif",
        6: "../images/flyers.gif",
        10: "../images/penguins.gif",
        26: "../images/sharks.gif",
        17: "../images/blues.gif",
        1: "../images/lightning.gif",
        12: "../images/mapleleafs.gif",
        21: "../images/canucks.gif",
        142: "../images/goldenknights.gif",
        5: "../images/capitals.gif",
        2: "../images/jets.gif"
    }
}


module.exports = pb;