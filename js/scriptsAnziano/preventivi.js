function creaPulsantePreventivo(result, i){
    //Creazione div che conterrà il preventivo
    var newDiv = document.createElement('DIV');
    newDiv.id = 'div'+i;
    //Inserimento del nuovo div in quello contenente la lista dei preventivi
    document.getElementById('listaPreventivi').appendChild(newDiv);

    var contentDiv = document.createElement('DIV');
    contentDiv.id = 'contentDiv'+i;
    //Creazione button contenente il nome dell'utente offerente e il servizio offerto
    var newBtn = document.createElement('BUTTON');

    if(result[i]['stato'] == 'preventivoInviato'){
        newBtn.setAttribute("onclick", "hideDiv('listaPreventivi','preventivoRicevuto'); displayRiepilogo('"+result[i]['idPreventivo']+"', 'preventivoRicevuto')");
        newBtn.className = 'preventivoInviato'; //deve essere verde
        contentDiv.className = 'contenuto-Accettato';
    } else if(result[i]['stato'] == 'richiestaInviata'){
        newBtn.setAttribute("onclick", "hideDiv('listaPreventivi','preventivo'); displayRiepilogo('"+result[i]['idPreventivo']+"', 'preventivo')");
        newBtn.className = 'richiestaInviata'; //deve essere giallo
        contentDiv.className = 'contenuto-Inviato';
    } else if(result[i]['stato'] == 'richiestaRifiutata' || result[i]['stato'] == 'preventivoRifiutato'){
        newBtn.setAttribute("onclick", "hideDiv('listaPreventivi','preventivo'); displayRiepilogo('"+result[i]['idPreventivo']+"', 'preventivo')");
        newBtn.className = 'preventivoRifiutato'; //deve essere rosso
        contentDiv.className = 'contenuto-Rifiutato';
    }
    //aggiungere link al profilo
    newBtn.id = 'btn'+i;
    document.getElementById("div"+i).appendChild(contentDiv);
    document.getElementById("contentDiv"+i).appendChild(newBtn);

    //Inserimento del nome dell'utente offerente e del servizio offerto nel pulsante
    var name = document.createElement('H2');
    var servizio = document.createElement('H3');
    servizio.innerHTML = listaServizi[result['0']['idServizio']]
    name.innerHTML = result[i]['nomeOfferente'] + " " + result[i]['cognomeOfferente'];
    document.getElementById('btn'+i).appendChild(name);
    document.getElementById('btn'+i).appendChild(servizio);

    //<a href="#" class="linkprofilo" onclick="window.location.href='profiloanziano.html';">Visualizza profilo</a>
    var linkProfilo = document.createElement('A');
    linkProfilo.className = 'linkprofilo';
    linkProfilo.innerHTML = 'Visualizza profilo';
    linkProfilo.setAttribute("href", "#");
    linkProfilo.setAttribute("onclick", "localStorage.setItem('idUtente', '"+result[i]['idOfferente']+"'); window.location.href='profiloOfferente.html';");
    document.getElementById('div'+i).appendChild(linkProfilo);
}


function displayListaPreventivi() {
    const url= ip + '/queryAnziano/listaPreventivi.php';
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var vars = "id="+localStorage["id"]; 


    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(http.responseText);
            var fileName = location.href.split("/").slice(-1);
            //Per ciascun preventivo attivo viene creato un pulsante che porta alla schermata contenente i dettagli del preventivo

            for(var i=0; i<result.length; i++){
                if(result[i]['stato'] != 'finalizzato' && fileName != 'prenotazioniAnziano.html' && result[i]['stato'] == 'preventivoInviato'){
                    creaPulsantePreventivo(result, i);
                } else if(result[i]['stato'] == 'finalizzato' && fileName == 'prenotazioniAnziano.html'){
                        var position = listPosition+1
                        displayPreventiviFinalizzati(result, i, position);
                }
            }

            for(var i=0; i<result.length; i++){
                if(result[i]['stato'] != 'finalizzato' && fileName != 'prenotazioniAnziano.html' && result[i]['stato'] == 'richiestaInviata'){
                    creaPulsantePreventivo(result, i);
                } 
            }

            for(var i=0; i<result.length; i++){
                if(result[i]['stato'] != 'finalizzato' && fileName != 'prenotazioniAnziano.html' && (result[i]['stato'] == 'richiestaRifiutata' || result[i]['stato'] == 'preventivoRifiutato')){
                    creaPulsantePreventivo(result, i);
                } 
            }
        }
      };

      http.send(vars);
    }

    function displayPreventiviFinalizzati(result, i, position){
        setTimeout(() => {
            //Creazione div che conterrà il preventivo
            var newDiv = document.createElement('DIV');
            newDiv.className = 'p';
            newDiv.id = 'div'+position;
            //Inserimento del nuovo div in quello contenente la lista dei preventivi
            document.getElementById('listaAttive').appendChild(newDiv);

            //Creazione button contenente il nome dell'utente offerente e il servizio offerto
            var newBtn = document.createElement('BUTTON');

            newBtn.setAttribute("onclick", "hideDiv('listaAttive','preventivo'); displayRiepilogo('"+result[i]['idPreventivo']+"', 'preventivo')");
            newBtn.className = 'prenotazioni';

            //aggiungere link al profilo
            newBtn.id = 'btn'+position;
            document.getElementById("div"+position).appendChild(newBtn);

            var contentDiv = document.createElement('DIV');
            contentDiv.id = 'contentDiv'+position;
            contentDiv.className = 'contenuto-prenotazioni';
            document.getElementById('btn'+position).appendChild(contentDiv);

            //Inserimento del nome dell'utente offerente e del servizio offerto nel pulsante
            var name = document.createElement('H2');
            var servizio = document.createElement('H3');
            servizio.innerHTML = listaServizi[result['0']['idServizio']]
            name.innerHTML = result[i]['nomeOfferente'] + " " + result[i]['cognomeOfferente'];
            document.getElementById('contentDiv'+position).appendChild(name);
            document.getElementById('contentDiv'+position).appendChild(servizio);

            //<a href="#" class="linkprofilo" onclick="window.location.href='profiloanziano.html';">Visualizza profilo</a>
            var linkProfilo = document.createElement('A');
            linkProfilo.className = 'linkprofilo';
            linkProfilo.innerHTML = 'Visualizza profilo';
            linkProfilo.setAttribute("href", "#");
            linkProfilo.setAttribute("onclick", "localStorage.setItem('idUtente', '"+result[i]['idOfferente']+"'); localStorage.setItem('idLista', 'listaAttive'); localStorage.setItem('statoPrenotazione', 'accettata'); window.location.href='profiloOfferente.html';");
            document.getElementById('div'+position).appendChild(linkProfilo);
        }, 50);
    }

    function displayRiepilogo(idPreventivo, statoPreventivo){
        const url= ip + '/queryAnziano/riepilogoPreventivo.php';
        var http = new XMLHttpRequest();
        http.open("POST", url, true);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var vars = "id="+idPreventivo;

        http.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(http.responseText);

                //Inserimento informazioni relative al preventivo all'interno dell'html
                if(statoPreventivo == 'preventivoRicevuto'){ statoPreventivo = 'riepilogoPreventivo';
                    var name = document.createElement('P');
                    var servizio = document.createElement('P');
                    var data = document.createElement('P');
                    var ora = document.createElement('P');
                    var paga = document.createElement('P');
                    var note = document.createElement('P');

                    name.innerHTML = "Offerente servizio: "+ result['0']['nomeOfferente'] + " " + result['0']['cognomeOfferente'];
                    servizio.innerHTML = "Servizio: "+listaServizi[result['0']['idServizio']];
                    data.innerHTML = "Data: " + result['0']['data'];
                    ora.innerHTML = "Ora: " + result['0']['ora'];
                    paga.innerHTML = "Paga: " + result['0']['prezzo'] + " euro l'ora";
                    note.innerHTML = "Descrizione: " + result['0']['note'];


                    document.getElementById(statoPreventivo).appendChild(servizio);
                    document.getElementById(statoPreventivo).appendChild(data);
                    document.getElementById(statoPreventivo).appendChild(ora);
                    document.getElementById(statoPreventivo).appendChild(paga);
                    document.getElementById(statoPreventivo).appendChild(note);
                    document.getElementById(statoPreventivo).appendChild(name);

                    document.getElementById('rifiuta').setAttribute("onclick", "updatePreventivo('"+idPreventivo+"', 'preventivoRifiutato')");
                    document.getElementById('accetta').setAttribute("onclick", "updatePreventivo('"+idPreventivo+"', 'finalizzato');");

                    document.getElementById("back").setAttribute("onclick", "hideDiv('preventivoRicevuto', 'listaPreventivi'); resetBackButton('lista')");
                } else if(statoPreventivo == 'preventivo'){
                    document.getElementById('preventivo').innerHTML='';
                    var name = document.createElement('H2');
                    var servizio = document.createElement('P');
                    var data = document.createElement('P');
                    var ora = document.createElement('P');
                    var paga = document.createElement('P');
                    var note = document.createElement('P');
                    var stato = document.createElement('P');

                    name.innerHTML = result['0']['nomeOfferente'] + " " + result['0']['cognomeOfferente'];
                    servizio.innerHTML = "Servizio: "+listaServizi[result['0']['idServizio']];
                    data.innerHTML = "Data: " + result['0']['data'];
                    ora.innerHTML = "Ora: " + result['0']['ora'];
                    paga.innerHTML = "Paga: " + result['0']['prezzo'] + " euro l'ora";
                    note.innerHTML = "Descrizione: " + result['0']['note'];

                    if(result['0']['stato'] == 'richiestaInviata'){
                        stato.innerHTML = "Stato richiesta: In attesa di risposta";
                    } else if(result['0']['stato'] == 'richiestaRifiutata'){
                        stato.innerHTML = "Stato richiesta: Rifiutata da "+ result['0']['nomeOfferente'] + " " + result['0']['cognomeOfferente'];
                    }else if(result['0']['stato'] == 'preventivoRifiutato'){
                        stato.innerHTML = "Stato richiesta: Rifiutata da te";
                    } else if(result['0']['stato'] == 'finalizzato'){
                        document.getElementById("back").setAttribute("onclick", "hideDiv('preventivo', 'listaAttive'); resetBackButton('riepilogoPrenotazioni', 'listaAttive')");
                        document.getElementById('preventivo').innerHTML='';
                        stato.innerHTML = "Stato richiesta: Prenotazione attiva";
                    }

                   
                    document.getElementById(statoPreventivo).appendChild(name);
                    document.getElementById(statoPreventivo).appendChild(servizio);
                    document.getElementById(statoPreventivo).appendChild(data);
                    document.getElementById(statoPreventivo).appendChild(ora);
                    document.getElementById(statoPreventivo).appendChild(paga);
                    document.getElementById(statoPreventivo).appendChild(note);
                    document.getElementById(statoPreventivo).appendChild(stato);

                    if(fileName == 'prenotazioniAnziano.html'){
                        document.getElementById("back").setAttribute("onclick", "hideDiv('preventivo', 'listaAttive'); resetBackButton('riepilogoPrenotazioni', 'listaAttive')");
                    } else {
                        document.getElementById("back").setAttribute("onclick", "hideDiv('preventivo', 'listaPreventivi'); resetBackButton('lista')");
                    }
                }

            }
          };

          http.send(vars);
    }

    function updatePreventivo(idPreventivo, nuovoStato){
        const url= ip + '/queryAnziano/updatePreventivo.php';
        var http = new XMLHttpRequest();
        http.open("POST", url, true);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var vars = "nuovoStato="+nuovoStato+"&idPreventivo="+idPreventivo;

        http.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(http.responseText);
                location.reload()
            }
          };

          http.send(vars);
    }

    function resetBackButton(div, tipoRiepilogo){
        switch (div){
            case 'lista':
                document.getElementById("back").setAttribute( "onclick", "window.location.href='homeanziano.html'" );
                break;
            case 'riepilogoPrenotazioni':
                document.getElementById("back").setAttribute( "onclick", "hideDiv('"+tipoRiepilogo+"', 'firstpage'), resetBackButton('lista')" );
                break;
        }
    }
