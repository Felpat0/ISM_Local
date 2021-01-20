var stelle = 0;

document.addEventListener('input', function (event) {
    //Se è stata cliccata una stellina
    if(event.target.id.includes("star")){
        stelle = document.getElementById(event.target.id).value;
        console.log(stelle);
    }
}, false);

function inviaValutazione(){
    const url= ip + '/rilascioValutazione/rilascioValutazione.php';
      var http = new XMLHttpRequest();
      http.open("POST", url, true);
      http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      if(localStorage.getItem('tipoUtente') == 'anziano'){
        var vars = "idAnziano="+localStorage['id']+"&idOfferente="+localStorage['idUtente']+"&valutazione="+stelle+"&stato=rilasciataAnziano";
      } else if(localStorage.getItem('tipoUtente') == 'offerente'){
        var vars = "idOfferente="+localStorage['id']+"&idAnziano="+localStorage['idUtente']+"&valutazione="+stelle+"&stato=rilasciataOfferente";
      }

      http.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              var result =http.responseText;
              if(result == 'ok'){
                  console.log('recensione inviata'); //va fatto il controllo che lo stesso utente non stia rilasciando più di una recensione
              } else {
                  console.log(result);
              }
          }
        };

        http.send(vars);
}