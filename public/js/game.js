// var options = {
//     swipeable: true,
// }

// // init tabs
// var instance = M.Tabs.init(el, options);



$(document).ready(function () {
    $('.tabs').tabs();
    $('.scrollspy').scrollSpy();
    $('.modal').modal();
});






// This fixes tabs at the top of the game page. Not able to have the cards working and fixed tabs at the same time

window.onscroll = function () {
    // tabs();
    // shortcut();
};

var header = document.getElementById("myTabs");
var sticky = header.offsetTop;

function tabs() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}




var shortcuts = document.getElementsByClassName("shortCuts");
var sticky1 = shortcuts.offsetTop;

function shortcut() {
    if (window.pageYOffset > sticky1 -50) {
        header.classList.add("sticky1");
    } else {
        header.classList.remove("sticky1");
    }
}