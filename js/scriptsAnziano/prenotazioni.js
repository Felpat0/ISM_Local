var listPosition = 0;

function displayLista(idLista, statoPrenotazione){
    document.getElementById("back").setAttribute("onclick", "window.location.href='prenotazioniAnziano.html'");
    const url= ip + '/queryAnziano/getPrenotazioni.php';
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var vars = "id="+ localStorage["id"];

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById(idLista).innerHTML = '';
            var result = JSON.parse(http.responseText);
            //Per ciascuna prenotazione viene creato un pulsante che porta alla schermata contenente i dettagli della prenotazione

            for(var i=0; i<result.length; i++){

                var check = result[i]['stato'];

                if(result[i]['stato'] == 'completata') {check = 'rifiutata';}

                if(statoPrenotazione == check){
                    //Creazione div che conterrà la prenotazione
                    var newDiv = document.createElement('DIV');
                    newDiv.className = 'p';
                    newDiv.id = 'div'+i;
                    //Inserimento del nuovo div in quello contenente la lista delle prenotazioni
                    document.getElementById(idLista).appendChild(newDiv);

                    //Creazione button contenente il nome dell'utente offerente e il servizio offerto
                    var newBtn = document.createElement('BUTTON');
                    if(result[i]['stato'] == 'completata'){
                        newBtn.setAttribute("onclick", "hideDiv('"+idLista+"','"+statoPrenotazione+"'); displayRiepilogoPrenotazione('"+result[i]['idPrenotazione']+"','completata', '"+idLista+"')");
                    } else {
                        newBtn.setAttribute("onclick", "hideDiv('"+idLista+"','"+statoPrenotazione+"'); displayRiepilogoPrenotazione('"+result[i]['idPrenotazione']+"','"+statoPrenotazione+"', '"+idLista+"')");
                    }

                    newBtn.className = 'prenotazioni';
                    newBtn.id = 'btn'+i;
                    document.getElementById("div"+i).appendChild(newBtn);

                    var contentDiv = document.createElement('DIV');
                    contentDiv.id = 'contentDiv'+i;
                    contentDiv.className = 'contenuto-prenotazioni';
                    document.getElementById('btn'+i).appendChild(contentDiv);

                    //Inserimento del nome dell'utente offerente e del servizio offerto nel pulsante
                    var name = document.createElement('H3');
                    var servizio = document.createElement('H2');
                    name.innerHTML = result[i]['nomeOfferente'] + " " + result[i]['cognomeOfferente'];
                    servizio.innerHTML = listaServizi[result[i]['idServizio']];
                    document.getElementById('contentDiv'+i).appendChild(name);
                    document.getElementById('contentDiv'+i).appendChild(servizio);

                    var linkProfilo = document.createElement('A');
                    linkProfilo.className = 'linkprofilo';
                    linkProfilo.innerHTML = 'Visualizza profilo';
                    linkProfilo.setAttribute("href", "#");
                    linkProfilo.setAttribute("onclick", "localStorage.setItem('idUtente', '"+result[i]['idOfferente']+"'); localStorage.setItem('idLista', '"+idLista+"'); localStorage.setItem('statoPrenotazione', '"+statoPrenotazione+"'); window.location.href='profiloOfferente.html';");
                    document.getElementById('div'+i).appendChild(linkProfilo);

                    listPosition = i;
                }
            }
        }
      };

      http.send(vars);
}


function displayRiepilogoPrenotazione( idPrenotazione, statoPrenotazione, idLista){
    const url= ip + '/queryAnziano/riepilogoPren.php';
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var vars = "id="+idPrenotazione;

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(http.responseText);

            //Inserimento informazioni relative alla prenotazione all'interno dell'html
                var name = document.createElement('H3');
                var servizio = document.createElement('P');
                var data = document.createElement('P');
                var ora = document.createElement('P');
                var paga = document.createElement('P');
                var stato = document.createElement('P');

                name.innerHTML = result['0']['nomeOfferente'] + " " + result['0']['cognomeOfferente'];
                servizio.innerHTML = listaServizi[result['0']['idServizio']];
                data.innerHTML = "Data: " + result['0']['data'];
                ora.innerHTML = "Ora: " + result['0']['ora'];
                paga.innerHTML = "Paga: " + result['0']['pagaOraria'] + " euro l'ora";

                switch(statoPrenotazione){
                    case 'accettata':
                        stato.innerHTML= "Stato prenotazione: Attiva";
                        break;
                    case 'rifiutata':
                        stato.innerHTML= "Stato prenotazione: Rifiutata";
                        break;
                    case 'inviata':
                        stato.innerHTML= "Stato prenotazione: In attesa di risposta";
                        break;
                    case 'completata':
                        stato.innerHTML= "Stato prenotazione: Completata";
                        statoPrenotazione = 'rifiutata';
                        break;
                }

                var linkProfilo = document.createElement('A');
                linkProfilo.className = 'linkprofilo';
                linkProfilo.innerHTML = 'Visualizza profilo';
                linkProfilo.setAttribute("href", "#");
                linkProfilo.setAttribute("onclick", "localStorage.setItem('idUtente', '"+result['0']['idOfferente']+"'); localStorage.setItem('idLista', '"+idLista+"'); localStorage.setItem('statoPrenotazione', '"+statoPrenotazione+"'); window.location.href='profiloOfferente.html';");

                document.getElementById(statoPrenotazione).innerHTML = '';
                document.getElementById(statoPrenotazione).appendChild(name);
                document.getElementById(statoPrenotazione).appendChild(servizio);
                document.getElementById(statoPrenotazione).appendChild(data);
                document.getElementById(statoPrenotazione).appendChild(ora);
                document.getElementById(statoPrenotazione).appendChild(paga);
                document.getElementById(statoPrenotazione).appendChild(stato);
                document.getElementById(statoPrenotazione).appendChild(linkProfilo);
                document.getElementById("back").setAttribute("onclick", "hideDiv('"+statoPrenotazione+"', '"+idLista+"'); resetBackButtonp('riepilogo', '"+idLista+"')");
        }
      };

      http.send(vars);
}

function resetBackButtonp(div, idLista){
    switch (div){
        case 'lista':
            document.getElementById("back").setAttribute( "onclick", "window.location.href='homeanziano.html'" );
            break;
        case 'riepilogo':
            document.getElementById("back").setAttribute( "onclick", "hideDiv('"+idLista+"', 'firstpage'); resetBackButtonp('lista');" );
            break;
    }
}
