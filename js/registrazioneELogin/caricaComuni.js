var jsonComuni;

function loadJSON(callback) {
   var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
   xobj.open('GET', 'https://raw.githubusercontent.com/dakk/Italia.json/master/italia_comuni.json', true); // Replace 'appDataServices' with the path to your file
   xobj.onreadystatechange = function () {
         if (xobj.readyState == 4 && xobj.status == "200") {
           callback(xobj.responseText);
         }
   };
   xobj.send(null);
}


function init() {
 loadJSON(function(response) {
    jsonComuni = JSON.parse(response);
    if(window.location.href.includes("modificaProfiloOfferente")){
      loadJSONPrenotazioni();
    }
 });
}

init();
