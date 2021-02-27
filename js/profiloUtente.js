setTimeout(function(){
    if(localStorage.getItem('idLista')){
        document.getElementById("back").setAttribute("onclick", "window.location.href='prenotazioniAnziano.html'");
    } else if(localStorage.getItem('statoPrenotazione') == 'listaUtenti') {
        document.getElementById("back").setAttribute("onclick", "window.location.href='richiediservizioanziano.html'");
    } else {
        document.getElementById("back").setAttribute("onclick", "window.location.href='preventiviAnziano.html'");
    }

    const url= ip + '/profiloUtente/profiloUtente.php';
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var vars = "id="+localStorage['idUtente']+"&tipoUtente="+localStorage['tipoUtente'];

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var fileName = location.href.split("/").slice(-1);
            var result = JSON.parse(http.responseText);
            var tipo;

            if(localStorage.getItem('tipoUtente') == 'offerente') {tipo = 'Anziano';}
            else {tipo = 'Offerente';}

            if(fileName == 'chat.html'){
                document.getElementById('nomeCognome').innerHTML = result['0']['nome'+tipo] + ' ' + result['0']['cognome'+tipo];
                localStorage.removeItem('idUtente');
            } else {
                document.getElementById('nome').innerHTML = result['0']['nome'+tipo];
                document.getElementById('cognome').innerHTML = result['0']['cognome'+tipo];
                if(localStorage.getItem('tipoUtente')=='offerente'){
                    document.getElementById('indirizzo').innerHTML = result['0']['indirizzo'];
                }
                document.getElementById('telefono').innerHTML = result['0']['telefono'+tipo];
                document.getElementById('email').innerHTML = result['0']['email'+tipo];
            }
        }
    };

    http.send(vars);

}, 200);
