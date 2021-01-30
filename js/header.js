var html = `
<div id="logo">
  <img id="logo" src="img/logoGG.png">
</div>
<div id="barra">
  <ul id="menu">
    <li><a id="home"><img id="icona" src="img/home.png"></a></li>
    <li><a id="notifica" onclick="window.location.href = 'notifiche.html'"><img id="icona" src="img/notifica.png"></a>
    <li id="nuovaNotifica" onclick="window.location.href = 'notifiche.html'"><img id="icona" src="img/nuovanotifica.png"></a></li>
    <li><a id="messaggio" onclick="window.location.href = 'chat.html'"><img id="icona" src="img/messaggio.png"></a></li>
    <li><a id="profilo"><img id="icona" src="img/account.png"></a> </li>
    <li> <a id="logout" onclick="logout();"><img id="icona" src="img/logout.png"></a></li>
  </ul>
</div>
<button onclick="" id="back"><</button> `;

document.getElementById('testa').innerHTML = html;

var fileName = location.href.split("/").slice(-1);
var notifiche;
var notificheDaLeggere = [];

//Elimina pulsante back dalle home
if(fileName == 'homeanziano.html' || fileName == 'homeutente.html' || fileName == 'notifiche.html'){
  var backButton = document.getElementById('back');
  backButton.remove();
}

if(localStorage.getItem('tipoUtente') == 'offerente'){
  document.getElementById('home').setAttribute("onclick", "window.location.href = 'homeutente.html'");
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
      notifiche = JSON.parse(http.responseText);
      console.log(notifiche);
      //Inserire le notifiche nell'html
      var nuoveNotifiche = false;
      var j = 0;
      for(i = 1; i != notifiche.length; i++){
        if(notifiche[i]["daLeggere"] == 1){
          nuoveNotifiche = true;
          notificheDaLeggere[j] = notifiche[i];
          j++;
        }
      }
      //Se ci sono nuove notifiche, cambiare l'icona sulla barra
      if(nuoveNotifiche){
        if(fileName == 'notifiche.html'){
          loadNotifiche();
        }
        document.getElementById('notifica').style.display = "none";
        document.getElementById('nuovaNotifica').style.display = "inline";
      }
    }
  };
  http.send(vars);
}

loadJSONNotifiche();

function loadNotifiche(){
  for(i = 0; i != notificheDaLeggere.length; i++){
    document.getElementById("lista_notifiche").innerHTML += `
    <div id="notifica` + i + `">
    <button onclick="readNotifica(` + notificheDaLeggere[i]["idNotifica"] + `, ` + i + `)" class="notifica_cliccabile">` + notificheDaLeggere[i]["testo"] + `</button>
    </div>
    `;
  }
}

function readNotifica(idNotifica, i){
  //Impostare la notifica come letta
  const url= ip + '/readNotifica.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var vars = "idNotifica=" + idNotifica;
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if(localStorage["tipoUtente"] == "offerente"){
        if(notificheDaLeggere[i]["tipo"] == "preventivo"){
          window.location.href = 'preventiviOfferente.html';
        }else if(notificheDaLeggere[i]["tipo"] == "prenotazione"){
          window.location.href = 'prenotazioniOfferente.html';
        }else if(notificheDaLeggere[i]["tipo"] == "feedback"){
          //window.location.href = 'preventiviOfferente.html';
        }
      }else if(localStorage["tipoUtente"] == "anziano"){
        if(notificheDaLeggere[i]["tipo"] == "preventivo"){
          window.location.href = 'preventiviAnziano.html';
        }else if(notificheDaLeggere[i]["tipo"] == "prenotazione"){
          window.location.href = 'prenotazioniAnziano.html';
        }else if(notificheDaLeggere[i]["tipo"] == "feedback"){
          //window.location.href = 'preventiviOfferente.html';
        }
      }
    }
  };
  http.send(vars);
}

function logout(){
  localStorage["id"] = "";
  localStorage["tipoUtente"] = "";
  window.location.href = "login.html";
}
