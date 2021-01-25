var idOfferente = 0;

function getIdOfferente(id){
    idOfferente = id;
}


function getListaChat(){
    setTimeout(function(){
        localStorage.setItem('id', 1);
        localStorage.setItem('tipoUtente', 'anziano');

        const url= ip + '/chat/listaChat.php';
        var http = new XMLHttpRequest();
        http.open("POST", url, true);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var vars = "id=" + localStorage['id'] + "&tipoUtente=" + localStorage['tipoUtente'];//+ localStorage['id']; 

        http.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(http.responseText);
                console.log(result);

                if(result == 'queryError'){
                    console.log('errore server');
                    //display messaggio errore
                } else if(result == 'ok'){
                    document.getElementById('messaggio').value = '';
                    //display messaggio
                }
            }
        };

        http.send(vars);
    }, 250);
}

function getMessaggi(){

}


function inviaMessaggio(){
    var data = new Date().toISOString().slice(0, 10);
    var ora = new Date().toLocaleTimeString();
    var testo = document.getElementById('messaggio').value;
    localStorage.setItem('id', 1);
    localStorage.setItem('tipoUtente', 'anziano');
    idOfferente = 1;

    const url= ip + '/chat/inviaMessaggio.php';
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var vars = 'idAnziano=' + localStorage['id'] + '&idOfferente=' + idOfferente + '&tipoUtente=' + localStorage['tipoUtente'] + '&data=' + data + '&ora=' + ora + '&testo=' + testo; //idAnziano, idOfferente, idServizio, note, data, ora, stato

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = http.responseText;

            if(result == 'queryError'){
                console.log('errore server');
                //display messaggio errore
            } else if(result == 'ok'){
                document.getElementById('messaggio').value = '';
                //display messaggio
            }
        }
    };

    http.send(vars);
}

