var preventivi;

var messaggio = localStorage["messaggioPreventivi"];
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
  localStorage["messaggioPreventivi"] = "";
}

function updateBackButton(newDiv){
  var newOnclick;
  switch (newDiv){
    case "schermata1":
      newOnclick = "window.location.href='homeutente.html'";
      break;
    case "richiestePreventivo":
      newOnclick = "hideDiv('richiestePreventivo', 'schermata1'); ";
      newOnclick += "updateBackButton('schermata1');";
      break;
    case "riepilogoRichiestaPreventivo":
      newOnclick = "hideDiv('riepilogoRichiestaPreventivo', 'richiestePreventivo'); ";
      newOnclick += "updateBackButton('richiestePreventivo');";
      break;
    case "preventiviInviati":
      newOnclick = "hideDiv('preventiviInviati', 'schermata1'); ";
      newOnclick += "updateBackButton('schermata1');";
      break;
    case "riepilogoPreventivoInviato":
      newOnclick = "hideDiv('riepilogoPreventivoInviato', 'preventiviInviati'); ";
      newOnclick += "updateBackButton('preventiviInviati');";
      break;
  }
  document.getElementById("back").setAttribute("onclick", newOnclick);
}

function loadJSONPreventivi(){
  const url= ip + '/queryOfferente/getPreventivi.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //SETTO UN ID TEMPORANEO A CASO, DA ELIMINARE
  localStorage.setItem("id", 1);
  localStorage.setItem("tipoUtente", "offerente");
  var vars = "idOfferente=" + localStorage["id"];
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      preventivi = JSON.parse(http.responseText);
      loadRichiestePreventivo();
      loadPreventiviInviati();
    }
  };
  http.send(vars);
}

setTimeout(loadJSONPreventivi, 300);

function apriProfiloAnziano(idAnziano){
  localStorage.setItem('idUtente', idAnziano);
  window.location.href = 'profiloAnziano.html';
}

function loadRichiestePreventivo(){
  document.getElementById("richiestePreventivo").innerHTML = "";
  for(i = 0; i != preventivi.length; i++){
    if(preventivi[i]["stato"] == "richiestaInviata"){
      var element = `
      <div class="p">
        <button onclick="showRiepilogoRichiesta(` + i + `)" class="prenotazione">
          <h2>` + preventivi[i]["nomeAnziano"] + ` ` + preventivi[i]["cognomeAnziano"] + `</h2>
          <h3>` + listaServizi[preventivi[i]["idServizio"]] + `</h3>
        </button>
        <a href="#" class="linkprofilo" onclick="apriProfiloAnziano(` + preventivi[i]["idAnziano"] + `)">Visualizza profilo</a>
      </div>
      `;
      document.getElementById("richiestePreventivo").innerHTML += element;
    }
  }
}

function showRichiestePreventivo(){
  updateBackButton("richiestePreventivo");
  hideDiv("schermata1", "richiestePreventivo");
}

function showPreventiviInviati(){
  updateBackButton("preventiviInviati");
  hideDiv("schermata1", "preventiviInviati");
}

function showRiepilogoRichiesta(i){
  document.getElementById("riepilogoRichiestaPreventivo").innerHTML = `
  <div id="prenotazione">
    <h3>Richiesta preventivo da ` + preventivi[i]["nomeAnziano"] + ` ` + preventivi[i]["cognomeAnziano"] + `</h3>
    <p>Servizio: ` + listaServizi[preventivi[i]["idServizio"]] + `</p>
    <p>Data: ` + preventivi[i]["data"] + `</p>
    <p>Ora: ` + preventivi[i]["ora"] + `</p>
    <p>Indirizzo: ` + preventivi[i]["indirizzo"] + `</p>
    <p>Descrizione: ` + preventivi[i]["note"] + `</p>
    <div class="modal fade" tabindex="-1" id="modalPaga" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Inserisci la paga oraria per questo preventivo</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="rating">
                  <input type="number" id="pagaOraria" class="form-control">
                </div>
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
            <button type="button" onclick="inviaPreventivo(` + preventivi[i]["idPreventivo"] + `, ` + preventivi[i]["idAnziano"] + `, ` + preventivi[i]["idOfferente"] + `, '` + preventivi[i]["nomeOfferente"] + ` ` + preventivi[i]["cognomeOfferente"] + `');" class="btn btn-primary">Invia preventivo</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <button data-bs-toggle="modal" data-bs-target="#modalPaga" class="accetta">Invia</button>
  <button onclick="rifiutaPreventivo(` + preventivi[i]["idPreventivo"] + `, ` + preventivi[i]["idAnziano"] + `, ` + preventivi[i]["idOfferente"] + `, '` + preventivi[i]["nomeOfferente"] + ` ` + preventivi[i]["cognomeOfferente"] + `');" class="rifiuta">Rifiuta</button>
  `;

  updateBackButton("riepilogoRichiestaPreventivo");
  hideDiv("richiestePreventivo", "riepilogoRichiestaPreventivo");
}

function loadPreventiviInviati(){
  document.getElementById("preventiviInviati").innerHTML = "";
  for(i = 0; i != preventivi.length; i++){
    if(preventivi[i]["stato"] != "richiestaInviata"){
      var element = `
      <div class="p">
        <button onclick="showRiepilogoPreventivoInviato(` + i + `)" class="` + preventivi[i]["stato"] + `">
          <h2>` + preventivi[i]["nomeAnziano"] + ` ` + preventivi[i]["cognomeAnziano"] + `</h2>
          <h3>` + listaServizi[preventivi[i]["idServizio"]] + `</h3>
        </button>
        <a href="#" class="linkprofilo" onclick="window.location.href='profiloanziano.html';">Visualizza profilo</a>
      </div>
      `;
      document.getElementById("preventiviInviati").innerHTML += element;
    }
  }
}

function showRiepilogoPreventivoInviato(i){
  var statoPreventivo = "";
  switch(preventivi[i]["stato"]){
    case "finalizzato":
      statoPreventivo = "Completato";
      break;
    case "preventivoInviato":
      statoPreventivo = "Inviato";
      break;
    case "richiestaRifiutata":
      statoPreventivo = "Richiesta rifiutata";
      break;
    case "preventivoRifiutato":
      statoPreventivo = "Preventivo rifiutato dall'utente";
      break;
  }
  document.getElementById("riepilogoPreventivoInviato").innerHTML = `
  <div id="prenotazione">
    <h3>Richiesta preventivo da ` + preventivi[i]["nomeAnziano"] + ` ` + preventivi[i]["cognomeAnziano"] + `</h3>
    <p>Servizio: ` + listaServizi[preventivi[i]["idServizio"]] + `</p>
    <p>Data: ` + preventivi[i]["data"] + `</p>
    <p>Ora: ` + preventivi[i]["ora"] + `</p>
    <p>Indirizzo: ` + preventivi[i]["indirizzo"] + `</p>
    <p>Descrizione: ` + preventivi[i]["note"] + `</p>
    <p>Paga oraria: ` + preventivi[i]["prezzo"] + `€</p>
    <p>Stato preventivo: ` + statoPreventivo + `</p>
  </div>
  `;
  updateBackButton("riepilogoPreventivoInviato");
  hideDiv("preventiviInviati", "riepilogoPreventivoInviato");
}

function inviaPreventivo(idPreventivo, idAnziano, idOfferente, nomeOfferente){
  const url= ip + '/queryOfferente/modificaPreventivo.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var vars = "idPreventivo=" + idPreventivo + "&prezzo=" + document.getElementById("pagaOraria").value + "&idAnziano=" + idAnziano  + "&idOfferente=" + idOfferente + "&nomeOfferente=" + nomeOfferente;;
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      localStorage.setItem("messaggioPreventivi", "Il preventivo e' stato inviato");
      window.location.href='preventiviOfferente.html';
    }
  };
  http.send(vars);
}

function rifiutaPreventivo(idPreventivo, idAnziano, idOfferente, nomeOfferente){
  const url= ip + '/queryOfferente/modificaPreventivo.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var vars = "idPreventivo=" + idPreventivo + "&idAnziano=" + idAnziano  + "&idOfferente=" + idOfferente + "&nomeOfferente=" + nomeOfferente;;
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      localStorage.setItem("messaggioPreventivi", "La richiesta di preventivo e' stata rifiutata");
      window.location.href='preventiviOfferente.html';
    }
  };
  http.send(vars);
}
