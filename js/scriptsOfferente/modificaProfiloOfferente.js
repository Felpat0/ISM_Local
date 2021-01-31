var dati;
var zone = [];
var nZone = 0;
var fasce = [];
var nFasce = 1;
var prezzi = [];

function loadJSONPrenotazioni(){
  const url = ip + '/profiloUtente/getZoneServiziFasce.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var vars = "idOfferente=" + localStorage["id"];
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      dati = JSON.parse(http.responseText);
      console.log(dati);
      setZoneEsistenti();
      setServiziEsistenti();
      setFasceEsistenti();
    }
  };
  http.send(vars);
}


function setZoneEsistenti(){
  //Aggiungi e riempi una select per ogni zona dell'utente
  for(t = 1; t != dati["zone"].length + 1; t++){
    nZone ++;

    tempHtml = `
      <div class="mb-3">
        <select id="regione` + t + `" class="regione form-select regione" aria-label="Provincia">
          <option selected>Regione</option>
        </select>
        <select id="provincia` + t + `" class="form-select provincia" aria-label="Provincia">
          <option selected>Provincia</option>
        </select>
        <select id="città` + t + `" class="form-select città" aria-label="Città">
          <option selected>Città</option>
        </select>
      </div>
    `;

    //Se è la prima select, inserire direttamente l'HTML
    if(t == 1){
      document.getElementById("listaZone").innerHTML += "<div id='zona" + t + "'>" + tempHtml + "</div>";
    }else{
      var oldT = t - 1;
      var fileInput = document.getElementById('zona' + oldT);
      var temp = document.createElement('div');
      temp.id = "zona" + t;
      temp.innerHTML += tempHtml;
      fileInput.parentNode.appendChild(temp);
    }
    //Riempire la select con regioni
    for(i = 0; i != jsonComuni["regioni"].length; i++){
      var temp = document.createElement("option");
      temp.text = jsonComuni["regioni"][i]["nome"];
      temp.value = i + 1;
      document.getElementById("regione" + t).add(temp)
    }

    //Selezionare la regione della zona i dell'utente
    var idRegione;
    var regione = dati["zone"][t - 1]["regione"];
    var dd = document.getElementById('regione' + t);
    for (var i = 0; i < dd.options.length; i++) {
        if (dd.options[i].text === regione) {
            dd.selectedIndex = i;
            idRegione = i - 1;
            break;
        }
    }
    //Riempire le province in base alla regione
    for(i = 0; i != jsonComuni["regioni"][idRegione]["province"].length; i++){
      var temp = document.createElement("option");
      temp.text = jsonComuni["regioni"][idRegione]["province"][i]["nome"];
      temp.value = i;
      document.getElementById("provincia" + t).add(temp)
    }
    //Selezionare la provincia della zona i dell'utente
    var idProvincia;
    var provincia = dati["zone"][t - 1]["provincia"];
    var dd = document.getElementById('provincia' + t);
    for (var i = 0; i < dd.options.length; i++) {
        if (dd.options[i].text === provincia) {
            dd.selectedIndex = i;
            idProvincia = i - 1;
            break;
        }
    }
    //Riempieri i comuni in base alla provincia
    for(i = 0; i != jsonComuni["regioni"][idRegione]["province"][idProvincia]["comuni"].length; i++){
      var temp = document.createElement("option");
      temp.text = jsonComuni["regioni"][idRegione]["province"][idProvincia]["comuni"][i]["nome"];
      temp.value = i;
      document.getElementById("città" + t).add(temp)
    }
    //Selezionare il comune della zona i dell'utente
    var città = dati["zone"][t - 1]["nomeCittà"];
    var dd = document.getElementById('città' + t);
    for (var i = 0; i < dd.options.length; i++) {
        if (dd.options[i].text === città) {
            dd.selectedIndex = i;
            break;
        }
    }
  }


}

function setServiziEsistenti(){
  //Scrivere l'html dei servizi
  for(i = 0; i != listaServizi.length; i++){
  	document.getElementById("listaServizi").innerHTML += `
  	<input id="check` + i + `" class="form-check-input" type="checkbox" value="">
  	<label id="label` + i + `" class="form-check-label" for="check` + i + `">
  		`+ listaServizi[i] + `
  	</label>
  	<input id="costoOrario` + i + `" class="form-control form-control-lg" type="number" placeholder="Costo orario" disabled>
  	<br/>`;
  }
  for(i = 0; i != dati["servizi"].length; i++){
    //"Checkare" la checkbox del servizio che l'utente corrente svolge
    document.getElementById("check" + dati["servizi"][i]["idServizio"]).checked = true;
    //Impostare la paga del servizio per l'utente corrente
    document.getElementById("costoOrario" + dati["servizi"][i]["idServizio"]).disabled = false;
    document.getElementById("costoOrario" + dati["servizi"][i]["idServizio"]).value = dati["servizi"][i]["pagaOraria"];
  }
}

function setFasceEsistenti(){
  //Aggiungo gli input per le fasce
  //(Una fascia è già presente nell'html, quindi ne serviranno n-1)
  for(i = 0; i != dati["fasceOrarie"].length - 1; i++){
    addFascia();
  }

  //Riempo gli input con le fasce dell'utente corrente
  for(i = 0; i != dati["fasceOrarie"].length; i++){
    t = i + 1;
    document.getElementById("inizio" + t).value = dati["fasceOrarie"][i]["oraInizio"];
    document.getElementById("fine" + t).value = dati["fasceOrarie"][i]["oraFine"];
  }
}

function clearSelect(id){
	var element = document.getElementById(id);
	for(i = element.options.length - 1; i != 0; i--){
		element.remove(i);
	}
}

document.addEventListener('input', function (event) {
	//----------------EVENTI PER LA SCHERMATA "ZONE"

	//Se si seleziona una regione, riempire la select corrispondente con le province
	if (event.target.classList.contains("regione")){
		//Prendere il numero contenuto nell'id della select
		var matches = event.target.id.match(/(\d+)/);
		indexZona = matches[0];
		//Resettare la select
		clearSelect("provincia" + indexZona);
    //Riempire la select delle province in base alla regione
    for(i = 0; i != jsonComuni["regioni"][event.target.value - 1]["province"].length; i++){
      var temp = document.createElement("option");
      temp.text = jsonComuni["regioni"][event.target.value - 1]["province"][i]["nome"];
      temp.value = i;
      document.getElementById("provincia" + indexZona).add(temp)
    }
  }else if(event.target.classList.contains("provincia")){
		//Prendere il numero contenuto nell'id della select
		var matches = event.target.id.match(/(\d+)/);
		indexZona = matches[0];
		//Resettare la select
		clearSelect("città" + indexZona);
    //Riempire la select dei comuni in base alla provincia
		var t = document.getElementById("regione" + indexZona);
		var idRegione = t.options[t.selectedIndex].value - 1;
		var idProvincia = event.target.value;
		for(i = 0; i != jsonComuni["regioni"][idRegione]["province"][idProvincia]["comuni"].length; i++){
      var temp = document.createElement("option");
      temp.text = jsonComuni["regioni"][idRegione]["province"][idProvincia]["comuni"][i]["nome"];
      temp.value = i;
      document.getElementById("città" + indexZona).add(temp)
    }
	}

	//----------------EVENTI PER LA SCHERMATA "SERVIZI"
	//Se è stato attivato uno dei servizi
	if(event.target.id.includes("check")){
		//Ottenere l'id del servizio
		var matches = event.target.id.match(/(\d+)/);
		indexInput = matches[0];
		//Se è già attivato, disattivarlo ed azzerare il form
		if(!document.getElementById("costoOrario" + indexInput).disabled){
			document.getElementById("costoOrario" + indexInput).value = "";
			document.getElementById("costoOrario" + indexInput).disabled = true;
		}else{
			//Se non è attivo, attivarlo
			document.getElementById("costoOrario" + indexInput).disabled = false;
		}
	}
}, false);


function addZona(){
  nZone ++;
  //Aggiungere delle "select" per una nuova zona
  var fileInput = document.getElementById('zona1');
  var temp = document.createElement('div');
  temp.id = "zona" + nZone;
  temp.innerHTML = `
    <div class="mb-3">
      <select id="regione` + nZone + `" class="form-select regione" aria-label="Regione">
        <option selected>Regione</option>
      </select>
      <select id="provincia` + nZone + `" class="form-select provincia" aria-label="Provincia">
        <option selected>Provincia</option>
      </select>
      <select id="città` + nZone + `" class="form-select città" aria-label="Città">
        <option selected>Città</option>
      </select>
    </div>
  `;
  fileInput.parentNode.appendChild(temp);

  //Riempire le select con regioni, province e comuni
  for(i = 0; i != jsonComuni["regioni"].length; i++){
    var temp = document.createElement("option");
    temp.text = jsonComuni["regioni"][i]["nome"];
    temp.value = i + 1;
    document.getElementById("regione" + nZone).add(temp)
  }
}

function showServizi(){
	  document.getElementById("zone").style.display = "none";
	  document.getElementById("servizi").style.display = "block";
}

function showFasce(){
	//Rendere invisibile la schermata dei servizi
  document.getElementById("servizi").style.display = "none";
	//Rendere visibile la schermata delle fasce
  document.getElementById("fasce").style.display = "block";
}

function addFascia(){
	  nFasce ++;
	  //Aggiungere degli input field per la nuova fascia
	  var fileInput = document.getElementById('fascia1');
	  var temp = document.createElement('div');
	  temp.id = "fascia" + nFasce;
	  temp.innerHTML = `
      <label for="inizio` + nFasce + `">Ora Inizio</label>
			<input id="inizio` + nFasce + `" class="form-control form-control-lg" type="time" placeholder="Ora inizio">
      <label for="fine` + nFasce + `">Ora Fine</label>
      <input id="fine` + nFasce + `" class="form-control form-control-lg" type="time" placeholder="Ora fine">
			<br/>
	  `;
	  fileInput.parentNode.appendChild(temp);
}

function inviaModifiche(){
  //Ottieni dati delle zone
	var zone = [];
	for(i = 1; i != nZone + 1; i++){
		var regione = document.getElementById("regione" + i);
		var provincia = document.getElementById("provincia" + i);
		var città = document.getElementById("città" + i);
		var temp = {Regione: regione.options[regione.selectedIndex].text,
		Provincia: provincia.options[provincia.selectedIndex].text,
		Città: città.options[città.selectedIndex].text};
		zone.push(temp)
	}

	//Ottieni dati dei servizi
	var servizi = [];
	for(i = 0; i != listaServizi.length; i++){
		if(document.getElementById("check" + i).checked){
			var idServizio = i;
			var costoOrario = document.getElementById("costoOrario" + i).value;
			var temp = {idServizio: idServizio, costoOrario: costoOrario};
			servizi.push(temp);
		}
	}

	//Ottieni dati delle fasce
	var fasce = [];
	for(i = 1; i != nFasce + 1; i++){
		var inizio = document.getElementById("inizio" + i).value;
		var fine = document.getElementById("fine" + i).value;
		var temp = {inizio: inizio, fine: fine};
		fasce.push(temp);
	}

  const url= ip + '/profiloUtente/modificaProfiloOfferente.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	//Inserire le variabili della prima schermata
  var vars = "parte=2&idOfferente=" + localStorage["id"];

	//Inserire le zone
	vars += "&nZone=" + nZone;
	for(i = 0; i != nZone; i ++){
		vars += "&regione" + i + "=" + zone[i]["Regione"];
		vars += "&provincia" + i + "=" + zone[i]["Provincia"];
		vars += "&città" + i + "=" + zone[i]["Città"];
	}

	//Inserire i servizi
	vars += "&nServizi=" + servizi.length;
	for(i = 0; i != servizi.length; i++){
		vars += "&idServizio" + i + "=" + servizi[i]["idServizio"];
		vars += "&costoOrario" + i + "=" + servizi[i]["costoOrario"];
	}

	//Inserire fasce orarie
	vars += "&nFasce=" + nFasce;
	for(i = 0; i != nFasce; i++){
		vars += "&inizio" + i + "=" + fasce[i]["inizio"];
		vars += "&fine" + i + "=" + fasce[i]["fine"];
	}
  console.log(vars);
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        window.location.href = "homeutente.html";
    }
  };
  http.send(vars);
}
