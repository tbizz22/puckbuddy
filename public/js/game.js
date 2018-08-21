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



window.onscroll = function() {myFunction()};

var header = document.getElementById("myTabs");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}