//var interval = setInterval(test, 10000);
function getListaChat(){
    setTimeout(function(){
        localStorage.setItem('id', 1);
        localStorage.setItem('tipoUtente', 'offerente');

        const url= ip + '/chat/listaChat.php';
        var http = new XMLHttpRequest();
        http.open("POST", url, true);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var vars = "id=" + localStorage['id'] + "&tipoUtente=" + localStorage['tipoUtente'];

        http.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(http.responseText);

                for(var i=0; i<result.length; i++){
                    //Creazione div che conterrà la chat
                    var newDiv = document.createElement('DIV');
                    newDiv.id = 'div'+i;
                    //Inserimento del nuovo div in quello contenente la lista delle chat
                    document.getElementById('listaChat').appendChild(newDiv);

                    //Creazione button contenente il nome dell'utente e l'ultimo messaggio ricevuto/inviato
                    var newBtn = document.createElement('BUTTON');
                    newBtn.className = 'element';
                    newBtn.id = 'btn'+i;

                    //Inserimento del nome dell'utente offerente e del messaggio
                    var name = document.createElement('H2');
                    var messaggio = document.createElement('P');
                    messaggio.innerHTML = result[i]['testo'];
                    
                    if(localStorage.getItem('tipoUtente') == 'anziano'){
                        name.innerHTML = result[i]['nomeOfferente'] + " " + result[i]['cognomeOfferente'];
                        if(result[i]['daLeggere'] == 1 && result[i]['mittente'] != 'anziano'){
                            messaggio.className = 'msg-unread';
                            name.innerHTML += '<a class="notification">⬤</a><';
                            newBtn.setAttribute("onclick", "hideDiv('listaChat','chat'); updateMessaggio('"+ result[i]['idOfferente'] +"'); getMessaggi('"+ result[i]['idOfferente'] +"'); setBackButton('chat')");
                        } else {
                            messaggio.className = 'msg';
                            newBtn.setAttribute("onclick", "hideDiv('listaChat','chat'); getMessaggi('"+ result[i]['idOfferente'] +"'); setBackButton('chat')");
                        }
                    } else {
                        name.innerHTML = result[i]['nomeAnziano'] + " " + result[i]['cognomeAnziano'];
                        if(result[i]['daLeggere'] == 1 && result[i]['mittente'] != 'offerente'){
                            messaggio.className = 'msg-unread';
                            name.innerHTML += '<a class="notification">⬤</a><';
                            newBtn.setAttribute("onclick", "hideDiv('listaChat','chat'); updateMessaggio('"+ result[i]['idAnziano'] +"'); getMessaggi('"+ result[i]['idAnziano'] +"'); setBackButton('chat')");
                        } else {
                            messaggio.className = 'msg';
                            newBtn.setAttribute("onclick", "hideDiv('listaChat','chat'); getMessaggi('"+ result[i]['idAnziano'] +"'); setBackButton('chat')");
                        }
                    }

                    document.getElementById("div"+i).appendChild(newBtn); 
                    document.getElementById('btn'+i).appendChild(name);
                    document.getElementById('btn'+i).appendChild(messaggio);
                }
            }
        };

        http.send(vars);
    }, 250);
}

function getMessaggi(id){
    localStorage.setItem('id', 1);
    localStorage.setItem('tipoUtente', 'offerente');

    const url= ip + '/chat/getMessaggi.php';
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var vars = 'id=' + localStorage['id'] + '&id2=' + id + '&tipoUtente=' + localStorage['tipoUtente']; 

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            var result = JSON.parse(http.responseText);

            for(var i=0; i<result.length; i++){

                var newDiv = document.createElement('DIV');
                newDiv.id = 'divM'+i;
                newDiv.className = 'message';
                document.getElementById('cronologia').appendChild(newDiv);

                var messaggio = document.createElement('DIV');

                if(localStorage.getItem('tipoUtente') == 'anziano'){
                    document.getElementById('nomeCognome').innerHTML =  result[i]['nomeOfferente'] + " " + result[i]['cognomeOfferente'];
                    if(result[i]['mittente'] != 'anziano'){
                        messaggio.className = 'bubble-ricevuto bubble-bottom-left';
                    } else {
                        messaggio.className = 'bubble-inviato bubble-bottom-right';
                    }
                } else {
                    document.getElementById('nomeCognome').innerHTML =  result[i]['nomeAnziano'] + " " + result[i]['cognomeAnziano'];
                    if(result[i]['mittente'] != 'offerente'){
                        messaggio.className = 'bubble-ricevuto bubble-bottom-left';
                    } else {
                        messaggio.className = 'bubble-inviato bubble-bottom-right';
                    }
                }

                messaggio.innerHTML = result[i]['testo'];
                
                document.getElementById('divM'+i).appendChild(messaggio);
                document.getElementById('divM'+i).innerHTML += '<br style="clear:both" />';
                document.getElementById('send').setAttribute("onclick", "inviaMessaggio('"+id+"')");

                var e = document.getElementById('divM'+i);
                e.scrollIntoView(false);
            }
        }
    };

    http.send(vars);
}


function inviaMessaggio(id){
    var data = new Date().toISOString().slice(0, 10);
    var ora = new Date().toLocaleTimeString();
    var testo = document.getElementById('msg').value;
    localStorage.setItem('id', 1);
    localStorage.setItem('tipoUtente', 'offerente');

    const url= ip + '/chat/inviaMessaggio.php';
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    if(localStorage.getItem('tipoUtente') == 'anziano'){
        var vars = 'idAnziano=' + localStorage['id'] + '&idOfferente=' + id + '&tipoUtente=' + localStorage['tipoUtente'] + '&data=' + data + '&ora=' + ora + '&testo=' + testo; //idAnziano, idOfferente, idServizio, note, data, ora, stato
    } else {
        var vars = 'idAnziano=' + id + '&idOfferente=' + localStorage['id'] + '&tipoUtente=' + localStorage['tipoUtente'] + '&data=' + data + '&ora=' + ora + '&testo=' + testo; //idAnziano, idOfferente, idServizio, note, data, ora, stato
    }
    

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = http.responseText;

            if(result == 'queryError'){
                console.log('errore server');
                //display messaggio errore
            } else if(result == 'ok'){
                document.getElementById('msg').value = '';
                document.getElementById('cronologia').innerHTML = '';
                getMessaggi(id);
            }
        }
    };

    http.send(vars);
}

function updateMessaggio(id){
    const url= ip + '/chat/updateMessaggio.php';
        var http = new XMLHttpRequest();
        http.open("POST", url, true);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        if(localStorage.getItem('tipoUtente') == 'anziano'){
            var vars = 'idAnziano=' + localStorage['id'] + '&idOfferente=' + id +'&daLeggere=0';  
        } else {
            var vars = 'idAnziano=' + id + '&idOfferente=' + localStorage['id'] + '&daLeggere=0'; 
        }

        http.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(http.responseText);
                document.getElementById('messaggio').style.display = "inline";
                document.getElementById('nuovoMessaggio').style.display = "none";
            }
          };
    
          http.send(vars);
}


function setBackButton(div){
    switch (div){
        case 'chat':
            document.getElementById("back").setAttribute( "onclick", "hideDiv('chat', 'listaChat'); setBackButton('home');" );
            document.getElementById('cronologia').innerHTML = '';
            break;
        case 'home':
            if(localStorage.getItem('tipoUtente') == 'anziano'){
                document.getElementById("back").setAttribute( "onclick", "window.location.href='homeanziano.html'" );
              } else {
                document.getElementById("back").setAttribute( "onclick", "window.location.href='homeutente.html'" );
              }
              break;
    }
}

