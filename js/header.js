var html = `
<div id="logo">
  <img id="logo" src="img/logoGG.png">
</div>
<div id="barra">
  <ul id="menu">
    <li><a id="home"><img id="icona" src="img/home.png"></a></li>
    <li><a id="notifica" onclick="window.location.href = 'notifiche.html'"><img id="icona" src="img/notifica.png"></a>
    <li id="nuovaNotifica"><a href="#"><img id="icona" src="img/nuovanotifica.png"></a></li>
    <li><a id="messaggio" onclick="window.location.href = 'chat.html'"><img id="icona" src="img/messaggio.png"></a></li>
    <li><a id="profilo"><img id="icona" src="img/account.png"></a> </li>
    <li> <a id="logout"><img id="icona" src="img/logout.png"></a></li>
  </ul>
</div>
<button onclick="" id="back"><</button> `;

document.getElementById('testa').innerHTML = html;

var fileName = location.href.split("/").slice(-1);

//Elimina pulsante back dalle home
if(fileName == 'homeanziano.html' || fileName == 'homeutente.html'){
  var backButton = document.getElementById('back');
  backButton.remove();
}

if(localStorage.getItem('tipoUtente') == 'offerente'){
  document.getElementById('home').setAttribute("onclick", "window.location.href = 'homeofferente.html'");
} else {
  document.getElementById('home').setAttribute("onclick", "window.location.href = 'homeanziano.html'");
}

document.getElementById('nuovaNotifica').style.display = "none";

//Carica le notifiche
function loadJSONNotifiche(){
  const url= ip + '/getNotifiche.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //SETTO UN ID TEMPORANEO A CASO, DA ELIMINARE
  localStorage.setItem("id", 1);
  localStorage.setItem("tipoUtente", "offerente");
  var vars = "id=" + localStorage["id"] + "&tipoUtente=" + localStorage["tipoUtente"];
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var notifiche = JSON.parse(http.responseText);
      //Inserire le notifiche nell'html
      var nuoveNotifiche = false;
      for(i = 0; i != notifiche.length; i++){
        if(notifiche[i]["daLeggere"] == 1){
          nuoveNotifiche = true;
          //SCRIVERE QUI LE NOTIFICHE NELL'HTML
        }
      }
      console.log(notifiche);

      //Se ci sono nuove notifiche, cambiare l'icona sulla barra
      if(nuoveNotifiche){
        document.getElementById('notifica').style.display = "none";
        document.getElementById('nuovaNotifica').style.display = "inline";
      }
    }
  };
  http.send(vars);
}

setTimeout(loadJSONNotifiche, 300);
