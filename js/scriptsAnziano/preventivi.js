
    const url= ip + '/queryAnziano/listaPreventivi.php';
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var vars = "id=1"; //+ localStorage["id"]; 

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(http.responseText);

            //Per ciascun preventivo attivo viene creato un pulsante che porta alla schermata contenente i dettagli del preventivo

            for(var i=0; i<result.length; i++){
                
                localStorage.setItem('idUtente'+i, result[i]['idOfferente']);

                //Creazione div che conterrà il preventivo
                var newDiv = document.createElement('DIV');
                newDiv.className = 'p';
                newDiv.id = 'div'+i;
                //Inserimento del nuovo div in quello contenente la lista dei preventivi
                document.getElementById('listaPreventivi').appendChild(newDiv);

                //Creazione button contenente il nome dell'utente offerente e il servizio offerto
                var newBtn = document.createElement('BUTTON');
                
                if(result[i]['stato'] == 'preventivoInviato'){
                    newBtn.setAttribute("onclick", "hideDiv('listaPreventivi','preventivoRicevuto'); displayRiepilogo('"+result[i]['idPreventivo']+"', 'preventivoRicevuto')");
                    newBtn.className = 'accettato';
                } else if(result[i]['stato'] == 'richiestaInviata'){
                    newBtn.setAttribute("onclick", "hideDiv('listaPreventivi','preventivo'); displayRiepilogo('"+result[i]['idPreventivo']+"', 'preventivo')");
                    newBtn.className = 'inattesa';
                } else if(result[i]['stato'] == 'richiestaRifiutata' || result[i]['stato'] == 'preventivoRifiutato'){
                    newBtn.setAttribute("onclick", "hideDiv('listaPreventivi','preventivo'); displayRiepilogo('"+result[i]['idPreventivo']+"', 'preventivo')");
                    newBtn.className = 'rifiutato';
                }
                //aggiungere link al profilo
                newBtn.id = 'btn'+i;
                document.getElementById("div"+i).appendChild(newBtn); 

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
                linkProfilo.setAttribute("onclick", "localStorage.setItem('index', '"+i+"'); window.location.href='profiloOfferente.html';");
                document.getElementById('div'+i).appendChild(linkProfilo);
            }
        }
      };

      http.send(vars);

    function displayRiepilogo(idPreventivo, statoPreventivo){
        const url= ip + '/queryAnziano/riepilogoPreventivo.php';
        var http = new XMLHttpRequest();
        http.open("POST", url, true);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var vars = "id="+idPreventivo;
    
        http.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(http.responseText);
                var result = JSON.parse(http.responseText);
    
                //Inserimento informazioni relative al preventivo all'interno dell'html
                if(statoPreventivo == 'preventivoRicevuto'){
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
                    paga.innerHTML = "Paga: " + result['0']['prezzo'] + "€ l'ora";
                    note.innerHTML = "Descrizione: " + result['0']['note'];
                        
                    
                    document.getElementById(statoPreventivo).appendChild(servizio);
                    document.getElementById(statoPreventivo).appendChild(data);
                    document.getElementById(statoPreventivo).appendChild(ora);
                    document.getElementById(statoPreventivo).appendChild(paga);
                    document.getElementById(statoPreventivo).appendChild(note);
                    document.getElementById(statoPreventivo).appendChild(name);

                    document.getElementById('rifiuta').setAttribute("onclick", "updatePreventivo('"+idPreventivo+"', 'preventivoRifiutato')");
                } else {
                    var name = document.createElement('P');
                    var servizio = document.createElement('P');
                    var data = document.createElement('P');
                    var ora = document.createElement('P');
                    var paga = document.createElement('P');
                    var note = document.createElement('P');
                    var stato = document.createElement('P');
    
                    name.innerHTML = "Offerente servizio: "+ result['0']['nomeOfferente'] + " " + result['0']['cognomeOfferente'];
                    servizio.innerHTML = "Servizio: "+listaServizi[result['0']['idServizio']];
                    data.innerHTML = "Data: " + result['0']['data'];
                    ora.innerHTML = "Ora: " + result['0']['ora'];
                    paga.innerHTML = "Paga: " + result['0']['prezzo'] + "€ l'ora";
                    note.innerHTML = "Descrizione: " + result['0']['note'];
                    
                    if(result['0']['stato'] == 'richiestaInviata'){
                        stato.innerHTML = "Stato richiesta: In attesa di risposta";
                    } else if(result['0']['stato'] == 'richiestaRifiutata'){
                        stato.innerHTML = "Stato richiesta: Rifiutata da "+ result['0']['nomeOfferente'] + " " + result['0']['cognomeOfferente'];
                    }else if(result['0']['stato'] == 'preventivoRifiutato'){
                        stato.innerHTML = "Stato richiesta: Rifiutata da te";
                    }
                    
                    document.getElementById(statoPreventivo).appendChild(servizio);
                    document.getElementById(statoPreventivo).appendChild(data);
                    document.getElementById(statoPreventivo).appendChild(ora);
                    document.getElementById(statoPreventivo).appendChild(paga);
                    document.getElementById(statoPreventivo).appendChild(note);
                    document.getElementById(statoPreventivo).appendChild(name);
                    document.getElementById(statoPreventivo).appendChild(stato);
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
            }
          };
    
          http.send(vars);
    }