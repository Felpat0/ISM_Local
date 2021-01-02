
function hideDiv(div1, div2){
    var x = document.getElementById(div1);
    var y = document.getElementById(div2);
    x.style.display = "none";
    y.style.display = "block";
}

function displayLista(phpFile, idLista, statoPrenotazione){
    const url= ip + '/queryAnziano/'+phpFile;
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var vars = "id=1"; //+ localStorage["id"]; 

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(http.responseText);
            var result = JSON.parse(http.responseText);

            for(var i=0; i<result.length; i++){
                
                var newDiv = document.createElement('DIV');
                newDiv.className = 'p';
                newDiv.id = 'div'+i;
                document.getElementById(idLista).appendChild(newDiv);

                var newBtn = document.createElement('BUTTON');
                if(statoPrenotazione == 'prenotazioneAttiva'){
                    newBtn.setAttribute("onclick", "hideDiv('"+idLista+"','"+statoPrenotazione+"'); displayRiepilogo('riepilogoPrenAtt.php','"+result[i]['idPrenotazione']+"','"+statoPrenotazione+"')");
                } else {
                    newBtn.setAttribute("onclick", "hideDiv('"+idLista+"','"+statoPrenotazione+"'); displayRiepilogo('riepilogoPrenNonAtt.php','"+result[i]['idPrenotazione']+"','"+statoPrenotazione+"')");
                }
                newBtn.className = 'prenotazione';
                newBtn.id = 'btn'+i;
                document.getElementById("div"+i).appendChild(newBtn);

                var name = document.createElement('H2');
                var servizio = document.createElement('H3');
                name.innerHTML = result[i]['nomeOfferente'] + " " + result[i]['cognomeOfferente'];
                servizio.innerHTML = result[i]['nomeServizio'];
                document.getElementById('btn'+i).appendChild(name);
                document.getElementById('btn'+i).appendChild(servizio);
            }
        }
      };

      http.send(vars);
}

function displayRiepilogo(phpFile, idPrenotazione, statoPrenotazione){
    const url= ip + '/queryAnziano/'+phpFile;
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var vars = "id="+idPrenotazione;

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(http.responseText);
            var result = JSON.parse(http.responseText);

            if(statoPrenotazione == 'prenotazioneAttiva'){
                var name = document.createElement('H3');
                var servizio = document.createElement('P');
                var data = document.createElement('P');
                var ora = document.createElement('P');
                var paga = document.createElement('P');

                name.innerHTML = result['0']['nomeOfferente'] + " " + result['0']['cognomeOfferente'];
                servizio.innerHTML = result['0']['nomeServizio'];
                data.innerHTML = "Data: " + result['0']['data'];
                ora.innerHTML = "Ora: " + result['0']['ora'];
                paga.innerHTML = "Paga: " + result['0']['pagaOraria'] + "€ l'ora";
                    
                document.getElementById(statoPrenotazione).appendChild(name);
                document.getElementById(statoPrenotazione).appendChild(servizio);
                document.getElementById(statoPrenotazione).appendChild(data);
                document.getElementById(statoPrenotazione).appendChild(ora);
                document.getElementById(statoPrenotazione).appendChild(paga);
            } else {
                var name = document.createElement('H3');
                var descrizione = document.createElement('P');

                name.innerHTML = result['0']['nomeOfferente'] + " " + result['0']['cognomeOfferente'];
                descrizione.innerHTML = "Servizio effettuato: "+ result['0']['nomeServizio'] + " il giorno " + result['0']['data'] + " alle ore "+result['0']['ora'];
            
                document.getElementById(statoPrenotazione).appendChild(name);
                document.getElementById(statoPrenotazione).appendChild(descrizione);
            }
            
        }
      };

      http.send(vars);
}