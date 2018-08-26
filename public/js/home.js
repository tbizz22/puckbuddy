// load Parallax Effect 

var options = 0;

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.parallax');
    var instances = M.Parallax.init(elems, options);
  });



//   load collapsible cards 
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems);
  });


$(".gameButton").on("click", function() {
    
    $("#games").addClass("hide");
    $("#load").removeClass("hide")
})


var dateTime = null;
var date = null;

var update = function() {
  date = moment(new Date())
  dateTime.html(date.format("dddd, MMMM Do YYYY"));
};

$(document).ready(function(){
  dateTime=$("#dateTime");
  update();  
})