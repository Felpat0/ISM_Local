var prenotazioni;

function loadJSONPrenotazioni(){
  const url= ip + '/queryOfferente/getPrenotazioni.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //SETTO UN ID TEMPORANEO A CASO, DA ELIMINARE
  localStorage.setItem("id", 1);
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
      element += '<a href="#" class="linkprofilo" onclick="">Visualizza profilo</a>';
      element += '</div>';
      document.getElementById("richiesteSospeso").innerHTML += element;
    }
  }
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
  <button class="accetta" onclick="modificaPrenotazione(` + prenotazioni[index]["idPrenotazione"] + `, 'accettata');">Accetta</button>
  <button class="rifiuta" onclick="modificaPrenotazione(` + prenotazioni[index]["idPrenotazione"] + `, 'rifiutata');">Rifiuta</button>
  `;
  document.getElementById("riepilogoSospeso").innerHTML = element;
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
  hideDiv("richiesteSospeso", "riepilogoArchiviate");
}

function modificaPrenotazione(idPrenotazione, nuovoStato){
  const url= ip + '/queryOfferente/modificaPrenotazione.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var vars = "idPrenotazione=" + idPrenotazione + "&nuovoStato=" + nuovoStato;
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(http.responseText);
    }
  };
  http.send(vars);
}
