var jsonComuni;

function loadJSON(callback) {
   var xobj = new XMLHttpRequest();
       xobj.overrideMimeType("application/json");
   xobj.open('GET', 'https://raw.githubusercontent.com/dakk/Italia.json/master/italia_comuni.json', true); // Replace 'appDataServices' with the path to your file
   xobj.onreadystatechange = function () {
         if (xobj.readyState == 4 && xobj.status == "200") {
           // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
           callback(xobj.responseText);
         }
   };
   xobj.send(null);
}


function init() {
 loadJSON(function(response) {
    jsonComuni = JSON.parse(response);
    console.log(jsonComuni);
 });
}

init();
