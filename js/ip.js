var ip = "";

const urlAltervista = 'http://www.pizzasummoners.altervista.org/ip.php';
var http = new XMLHttpRequest();
http.open("GET", urlAltervista, true);
http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
http.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    ip = http.responseText;
    console.log((http.responseText));
  }
};
http.send();
