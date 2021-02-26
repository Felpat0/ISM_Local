var prenotazioni;

var messaggio = localStorage["messaggioPrenotazioni"];
if(messaggio){
  document.getElementById("schermata1").innerHTML += `
  <div class="modal fade" tabindex="-1" id="modalMessaggio" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">` + messaggio + `</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
        </div>
      </div>
    </div>
  </div>
  `;
  var myModal = new bootstrap.Modal(document.getElementById('modalMessaggio'), {
  keyboard: false
  });
  myModal.toggle()
  localStorage["messaggioPrenotazioni"] = "";
}

function updateBackButton(newDiv){
  var newOnclick;
  switch (newDiv){
    case "schermata1":
      newOnclick = "window.location.href='homeutente.html'";
      break;
    case "prenotazioniAttive":
      newOnclick = "hideDiv('prenotazioniAttive', 'schermata1'); ";
      newOnclick += "updateBackButton('schermata1');";
      break;
    case "richiesteSospeso":
      newOnclick = "hideDiv('richiesteSospeso', 'schermata1'); ";
      newOnclick += "updateBackButton('schermata1');";
      break;
    case "riepilogoAttive":
      newOnclick = "hideDiv('riepilogoAttive', 'prenotazioniAttive'); ";
      newOnclick += "updateBackButton('prenotazioniAttive');";
      break;
    case "riepilogoSospeso":
      newOnclick = "hideDiv('riepilogoSospeso', 'richiesteSospeso'); ";
      newOnclick += "updateBackButton('richiesteSospeso');";
      break;
    case "richiesteArchiviate":
      newOnclick = "hideDiv('richiesteArchiviate', 'schermata1'); ";
      newOnclick += "updateBackButton('schermata1');";
      break;
    case "riepilogoArchiviate":
      newOnclick = "hideDiv('riepilogoArchiviate', 'richiesteArchiviate'); ";
      newOnclick += "updateBackButton('richiesteArchiviate');";
      break;
  }
  document.getElementById("back").setAttribute("onclick", newOnclick);
}

function loadJSONPrenotazioni(){
  const url= ip + '/queryOfferente/getPrenotazioni.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var vars = "idOfferente=" + localStorage["id"];
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      prenotazioni = JSON.parse(http.responseText);
      console.log(prenotazioni);
      loadPrenotazioniAttive();
      loadPrenotazioniInSospeso();
      loadPrenotazioniArchiviate();
    }
  };
  http.send(vars);
}

loadJSONPrenotazioni();

function apriProfiloAnziano(idAnziano){
  localStorage.setItem('idUtente', idAnziano);
  window.location.href = 'profiloAnziano.html';
}

function loadPrenotazioniAttive(){
  document.getElementById("prenotazioniAttive").innerHTML = "";
  //Scrivere la lista delle prenotazioni attive
  for(i = 0; i != prenotazioni["prenotazioni"].length; i++){
    if(prenotazioni["prenotazioni"][i]["stato"] == "accettata"){
      element = "";
      element += '<div class="prenotazioneContainer">';
      element += '<button onclick="showRiepilogoAttiva(' + i + ')" class="prenotazione">';
      element += '<h2>' + prenotazioni["prenotazioni"][i]["nomeAnziano"] + " " + prenotazioni["prenotazioni"][i]["cognomeAnziano"] + '</h2>'
      element += '<h3>' + listaServizi[prenotazioni["prenotazioni"][i]["idServizio"]] + '</h3>';
      element += '</button>';
      element += '<a href="#" class="linkprofilo" onclick="apriProfiloAnziano(' + prenotazioni["prenotazioni"][i]["idAnziano"] + ')">Visualizza profilo</a>';
      element += '</div>';
      document.getElementById("prenotazioniAttive").innerHTML += element;
    }
  }
  //Scrivere la lista delle prenotazioni attive derivanti da preventivo
  if(prenotazioni["preventiviAttivi"]){
    for(i = 0; i != prenotazioni["preventiviAttivi"].length; i++){
        element = "";
        element += '<div class="prenotazioneContainer">';
        element += '<button onclick="showRiepilogoPreventivoAttivo(' + i + ')" class="prenotazione">';
        element += '<h2>' + prenotazioni["preventiviAttivi"][i]["nomeAnziano"] + " " + prenotazioni["preventiviAttivi"][i]["cognomeAnziano"] + '</h2>'
        element += '<h3>' + listaServizi[prenotazioni["preventiviAttivi"][i]["idServizio"]] + '</h3>';
        element += '</button>';
        element += '<a href="#" class="linkprofilo" onclick="apriProfiloAnziano(' + prenotazioni["preventiviAttivi"][i]["idAnziano"] + ')">Visualizza profilo</a>';
        element += '</div>';
        document.getElementById("prenotazioniAttive").innerHTML += element;
    }
  }
}

function loadPrenotazioniInSospeso(){
  document.getElementById("richiesteSospeso").innerHTML = "";
  //Scrivere la lista delle richieste in sospeso
  for(i = 0; i != prenotazioni["prenotazioni"].length; i++){
    if(prenotazioni["prenotazioni"][i]["stato"] == "inviata"){
      element = "";
      element += '<div class="prenotazioneContainer">';
      element += '<button onclick="showRiepilogoSospeso(' + i + ')" class="prenotazione">';
      element += '<h2>' + prenotazioni["prenotazioni"][i]["nomeAnziano"] + " " + prenotazioni["prenotazioni"][i]["cognomeAnziano"] + '</h2>'
      element += '<h3>' + listaServizi[prenotazioni["prenotazioni"][i]["idServizio"]] + '</h3>';
      element += '</button>';
      element += '<a href="#" class="linkprofilo" onclick="apriProfiloAnziano(' + prenotazioni["prenotazioni"][i]["idAnziano"] + ')">Visualizza profilo</a>';
      element += '</div>';
      document.getElementById("richiesteSospeso").innerHTML += element;
    }
  }
}

function showPrenotazioniAttive(){
  updateBackButton("prenotazioniAttive");
  hideDiv("schermata1", "prenotazioniAttive");
}

function showRichiesteSospeso(){
  updateBackButton("richiesteSospeso");
  hideDiv("schermata1", "richiesteSospeso");
}

function showRichiesteArchiviate(){
  updateBackButton("richiesteArchiviate");
  hideDiv("schermata1", "richiesteArchiviate");
}

function setPrenotazioneCompletata(idPrenotazione){
  const url= ip + '/queryAnziano/updatePrenotazione.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var vars = "idPrenotazione="+idPrenotazione+"&nuovoStato=completata";
  http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if(http.responseText == "ok"){
          localStorage.setItem("messaggioPrenotazioni", "Il servizio è stato segnalato come completato");
          window.location.href = "prenotazioniOfferente.html";
        }
      }
    };
    http.send(vars);
}

function setPreventivoCompletato(idPreventivo){
  const url= ip + '/queryAnziano/updatePreventivo.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var vars = "idPreventivo="+idPreventivo+"&nuovoStato=completato";

  http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if(http.responseText == "ok"){
          localStorage.setItem("messaggioPrenotazioni", "Il servizio è stato segnalato come completato");
          window.location.href = "prenotazioniOfferente.html";
        }
      }
    };
    http.send(vars);
}

function showRiepilogoAttiva(index){
  element = `
  <div id="prenotazione">
    <h3>Richiesta prenotazione di ` + prenotazioni["prenotazioni"][index]["nomeAnziano"] + " " + prenotazioni["prenotazioni"][index]["cognomeAnziano"] + `</h3>
    <p>Servizio: ` + listaServizi[prenotazioni["prenotazioni"][index]["idServizio"]] + `</p>
    <p>Data: ` + prenotazioni["prenotazioni"][index]["data"] + `</p>
    <p>Ora: ` + prenotazioni["prenotazioni"][index]["ora"] + `</p>
    <p>Indirizzo: ` + prenotazioni["prenotazioni"][index]["indirizzo"] + `</p>
    <p>Paga: ` + prenotazioni["pagaOraria"][prenotazioni["prenotazioni"][index]["idServizio"]]["pagaOraria"] + ` euro l'ora</p>
    <a href="#" class="linkprofilo-riepilogo" onclick="apriProfiloAnziano(' + prenotazioni["prenotazioni"][i]["idAnziano"] + ')">Visualizza profilo</a>
    <button onclick="setPrenotazioneCompletata(` + prenotazioni["prenotazioni"][index]["idPrenotazione"] + `)" class="conferma">Richiesta compiuta</button>
  </div>`;
  document.getElementById("riepilogoAttive").innerHTML = element;

  updateBackButton("riepilogoAttive");
  hideDiv("prenotazioniAttive", "riepilogoAttive");
}

function showRiepilogoPreventivoAttivo(index){
  element = `
  <div id="prenotazione">
    <h3>Richiesta prenotazione di ` + prenotazioni["preventiviAttivi"][index]["nomeAnziano"] + " " + prenotazioni["preventiviAttivi"][index]["cognomeAnziano"] + `</h3>
    <p>Servizio: ` + listaServizi[prenotazioni["preventiviAttivi"][index]["idServizio"]] + `</p>
    <p>Data: ` + prenotazioni["preventiviAttivi"][index]["data"] + `</p>
    <p>Ora: ` + prenotazioni["preventiviAttivi"][index]["ora"] + `</p>
    <p>Indirizzo: ` + prenotazioni["preventiviAttivi"][index]["indirizzo"] + `</p>
    <p>Paga: ` + prenotazioni["preventiviAttivi"][index]["prezzo"] + ` euro l'ora</p>
    <p>Note: ` + prenotazioni["preventiviAttivi"][index]["note"] + `</p>
    <a href="#" class="linkprofilo-riepilogo" onclick="apriProfiloAnziano(' + prenotazioni["prenotazioni"][i]["idAnziano"] + ')">Visualizza profilo</a>
    <button onclick="setPreventivoCompletato(` + prenotazioni["preventiviAttivi"][index]["idPreventivo"] + `)" class="conferma">Richiesta compiuta</button>
  </div>`;
  document.getElementById("riepilogoAttive").innerHTML = element;

  updateBackButton("riepilogoAttive");
  hideDiv("prenotazioniAttive", "riepilogoAttive");
}

function showRiepilogoSospeso(index){
  element = `
  <div id="prenotazione">
    <h3>Richiesta prenotazione di ` + prenotazioni["prenotazioni"][index]["nomeAnziano"] + " " + prenotazioni["prenotazioni"][index]["cognomeAnziano"] + `</h3>
    <p>Servizio: ` + listaServizi[prenotazioni["prenotazioni"][index]["idServizio"]] + `</p>
    <p>Data: ` + prenotazioni["prenotazioni"][index]["data"] + `</p>
    <p>Ora: ` + prenotazioni["prenotazioni"][index]["ora"] + `</p>
    <p>Indirizzo: ` + prenotazioni["prenotazioni"][index]["indirizzo"] + `</p>
    <p>Paga: ` + prenotazioni["pagaOraria"][prenotazioni["prenotazioni"][index]["idServizio"]]["pagaOraria"] + ` euro l'ora</p>
    <a href="#" class="linkprofilo-riepilogo" onclick="apriProfiloAnziano(' + prenotazioni["prenotazioni"][i]["idAnziano"] + ')">Visualizza profilo</a>
  </div>
  <button class="accetta" onclick="modificaPrenotazione(` + prenotazioni["prenotazioni"][index]["idPrenotazione"] + `, 'accettata', ` + prenotazioni["prenotazioni"][index]["idAnziano"] + `, ` + prenotazioni["prenotazioni"][index]["idOfferente"] + `, '` + prenotazioni["prenotazioni"][index]["nomeOfferente"] + ` ` + prenotazioni["prenotazioni"][index]["cognomeOfferente"] + `');">Accetta</button>
  <button class="rifiuta" onclick="modificaPrenotazione(` + prenotazioni["prenotazioni"][index]["idPrenotazione"] + `, 'rifiutata', ` + prenotazioni["prenotazioni"][index]["idAnziano"] + `, ` + prenotazioni["prenotazioni"][index]["idOfferente"] + `, '` + prenotazioni["prenotazioni"][index]["nomeOfferente"] + ` ` + prenotazioni["prenotazioni"][index]["cognomeOfferente"] + `');">Rifiuta</button>
  `;
  document.getElementById("riepilogoSospeso").innerHTML = element;

  updateBackButton("riepilogoSospeso");
  hideDiv("richiesteSospeso", "riepilogoSospeso");
}

function loadPrenotazioniArchiviate(){
  document.getElementById("richiesteArchiviate").innerHTML = "";
  //Scrivere la lista delle richieste in sospeso
  for(i = 0; i != prenotazioni["prenotazioni"].length; i++){
    if(prenotazioni["prenotazioni"][i]["stato"] == "completata" || prenotazioni["prenotazioni"][i]["stato"] == "rifiutata"){
      element = "";
      element += '<div class="prenotazioneContainer">';
      element += '<button onclick="showRiepilogoArchiviate(' + i + ')" class="prenotazione">';
      element += '<h2>' + prenotazioni["prenotazioni"][i]["nomeAnziano"] + " " + prenotazioni["prenotazioni"][i]["cognomeAnziano"] + '</h2>'
      element += '<h3>' + listaServizi[prenotazioni["prenotazioni"][i]["idServizio"]] + '</h3>';
      element += '</button>';
      element += '<a href="#" class="linkprofilo" onclick="">Visualizza profilo</a>';
      element += '</div>';
      document.getElementById("richiesteArchiviate").innerHTML += element;
    }
  }
}

function showRiepilogoArchiviate(index){
  element = `
  <div id="prenotazione">
    <h3>Richiesta prenotazione di ` + prenotazioni["prenotazioni"][index]["nomeAnziano"] + " " + prenotazioni["prenotazioni"][index]["cognomeAnziano"] + `</h3>
    <p>Servizio: ` + listaServizi[prenotazioni["prenotazioni"][index]["idServizio"]] + `</p>
    <p>Data: ` + prenotazioni["prenotazioni"][index]["data"] + `</p>
    <p>Ora: ` + prenotazioni["prenotazioni"][index]["ora"] + `</p>
    <p>Indirizzo: ` + prenotazioni["prenotazioni"][index]["indirizzo"] + `</p>
    <p>Paga: ` + prenotazioni["pagaOraria"][prenotazioni["prenotazioni"][index]["idServizio"]]["pagaOraria"] + ` euro l'ora</p>
    <p>Stato: ` + prenotazioni["prenotazioni"][index]["stato"] + `</p>
  </div>
  `;

  document.getElementById("riepilogoArchiviate").innerHTML = element;

  updateBackButton("riepilogoArchiviate");
  hideDiv("richiesteArchiviate", "riepilogoArchiviate");
}

function modificaPrenotazione(idPrenotazione, nuovoStato, idAnziano, idOfferente, nomeOfferente){
  const url= ip + '/queryOfferente/modificaPrenotazione.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var vars = "idPrenotazione=" + idPrenotazione + "&nuovoStato=" + nuovoStato + "&idAnziano=" + idAnziano  + "&idOfferente=" + idOfferente + "&nomeOfferente=" + nomeOfferente;
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      localStorage.setItem("messaggioPrenotazioni", "La prenotazione e' stata " + nuovoStato);
      window.location.href='prenotazioniOfferente.html';
    }
  };
  http.send(vars);
}
