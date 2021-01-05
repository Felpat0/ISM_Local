var preventivi;

function loadJSONPreventivi(){
  const url= ip + '/queryOfferente/getPreventivi.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //SETTO UN ID TEMPORANEO A CASO, DA ELIMINARE
  localStorage.setItem("id", 1);
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

loadJSONPreventivi();

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
        <a href="#" class="linkprofilo" onclick="window.location.href='profiloanziano.html';">Visualizza profilo</a>
      </div>
      `;
      document.getElementById("richiestePreventivo").innerHTML += element;
    }
  }
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
    <p>Paga oraria:</p>
    <input type="number" id="pagaOraria" class="form-control">
  </div>
  <button onclick="inviaPreventivo(` + preventivi[i]["idPreventivo"] + `);" class="accetta">Invia</button>
  <button onclick="rifiutaPreventivo(` + preventivi[i]["idPreventivo"] + `);" class="rifiuta">Rifiuta</button>
  `;
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
  hideDiv("preventiviInviati", "riepilogoPreventivoInviato");
}

function inviaPreventivo(idPreventivo){
  const url= ip + '/queryOfferente/modificaPreventivo.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var vars = "idPreventivo=" + idPreventivo + "&prezzo=" + document.getElementById("pagaOraria").value;
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(http.responseText);
    }
  };
  http.send(vars);
}

function rifiutaPreventivo(idPreventivo){
  const url= ip + '/queryOfferente/modificaPreventivo.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var vars = "idPreventivo=" + idPreventivo;
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(http.responseText);
    }
  };
  http.send(vars);
}
