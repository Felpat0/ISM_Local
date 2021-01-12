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
    case "richiesteSospeso":
      newOnclick = "hideDiv('richiesteSospeso', 'schermata1'); ";
      newOnclick += "updateBackButton('schermata1');";
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
  //SETTO UN ID TEMPORANEO A CASO, DA ELIMINARE
  localStorage.setItem("id", 1);
  localStorage.setItem("tipoUtente", "offerente");
  var vars = "idOfferente=" + localStorage["id"];
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      prenotazioni = JSON.parse(http.responseText);
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

function loadPrenotazioniInSospeso(){
  document.getElementById("richiesteSospeso").innerHTML = "";
  //Scrivere la lista delle richieste in sospeso
  for(i = 0; i != prenotazioni.length; i++){
    if(prenotazioni[i]["stato"] == "inviata"){
      element = "";
      element += '<div class="p">';
      element += '<button onclick="showRiepilogoSospeso(' + i + ')" class="prenotazione">';
      element += '<h2>' + prenotazioni[i]["nomeAnziano"] + prenotazioni[i]["cognomeAnziano"] + '</h2>'
      element += '<h3>' + listaServizi[prenotazioni[i]["idServizio"]] + '</h3>';
      element += '</button>';
      element += '<a href="#" class="linkprofilo" onclick="apriProfiloAnziano(' + prenotazioni[i]["idAnziano"] + ')">Visualizza profilo</a>';
      element += '</div>';
      document.getElementById("richiesteSospeso").innerHTML += element;
    }
  }
}

function showRichiesteSospeso(){
  updateBackButton("richiesteSospeso");
  hideDiv("schermata1", "richiesteSospeso");
}

function showRichiesteArchiviate(){
  updateBackButton("richiesteArchiviate");
  hideDiv("schermata1", "richiesteArchiviate");
}

function showRiepilogoSospeso(index){
  element = `
  <div id="prenotazione">
    <h3>Richiesta prenotazione di ` + prenotazioni[index]["nomeAnziano"] + " " + prenotazioni[index]["cognomeAnziano"] + `</h3>
    <p>Servizio: ` + listaServizi[prenotazioni[index]["idServizio"]] + `</p>
    <p>Data: ` + prenotazioni[index]["data"] + `</p>
    <p>Ora: ` + prenotazioni[index]["ora"] + `</p>
    <p>Indirizzo: ` + prenotazioni[index]["indirizzo"] + `</p>
    <p>Paga: ` + prenotazioni[index]["pagaOraria"] + `€ l'ora</p>
  </div>
  <button class="accetta" onclick="modificaPrenotazione(` + prenotazioni[index]["idPrenotazione"] + `, 'accettata', ` + prenotazioni[index]["idAnziano"] + `, ` + prenotazioni[index]["idOfferente"] + `, '` + prenotazioni[index]["nomeOfferente"] + ` ` + prenotazioni[index]["cognomeOfferente"] + `');">Accetta</button>
  <button class="rifiuta" onclick="modificaPrenotazione(` + prenotazioni[index]["idPrenotazione"] + `, 'rifiutata', ` + prenotazioni[index]["idAnziano"] + `, ` + prenotazioni[index]["idOfferente"] + `, '` + prenotazioni[index]["nomeOfferente"] + ` ` + prenotazioni[index]["cognomeOfferente"] + `');">Rifiuta</button>
  `;
  document.getElementById("riepilogoSospeso").innerHTML = element;

  updateBackButton("riepilogoSospeso");
  hideDiv("richiesteSospeso", "riepilogoSospeso");
}

function loadPrenotazioniArchiviate(){
  document.getElementById("richiesteArchiviate").innerHTML = "";
  //Scrivere la lista delle richieste in sospeso
  for(i = 0; i != prenotazioni.length; i++){
    if(prenotazioni[i]["stato"] == "completata" || prenotazioni[i]["stato"] == "rifiutata"){
      element = "";
      element += '<div class="p">';
      element += '<button onclick="showRiepilogoArchiviate(' + i + ')" class="prenotazione">';
      element += '<h2>' + prenotazioni[i]["nomeAnziano"] + prenotazioni[i]["cognomeAnziano"] + '</h2>'
      element += '<h3>' + listaServizi[prenotazioni[i]["idServizio"]] + '</h3>';
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
    <h3>Richiesta prenotazione di ` + prenotazioni[index]["nomeAnziano"] + " " + prenotazioni[index]["cognomeAnziano"] + `</h3>
    <p>Servizio: ` + listaServizi[prenotazioni[index]["idServizio"]] + `</p>
    <p>Data: ` + prenotazioni[index]["data"] + `</p>
    <p>Ora: ` + prenotazioni[index]["ora"] + `</p>
    <p>Indirizzo: ` + prenotazioni[index]["indirizzo"] + `</p>
    <p>Paga: ` + prenotazioni[index]["pagaOraria"] + `€ l'ora</p>
    <p>Stato: ` + prenotazioni[index]["stato"] + `</p>
  </div>
  `;
  document.getElementById("riepilogoSospeso").innerHTML = element;
  document.getElementById("riepilogoArchiviate").innerHTML = element;

  updateBackButton("riepilogoArchiviate");
  hideDiv("richiesteSospeso", "riepilogoArchiviate");
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
