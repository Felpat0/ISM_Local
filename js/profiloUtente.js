
  //if(localStorage["tipoUtente" == "offerente"]){ //il controllo che va fatto è se l'utente è offerente
    const url= ip + '/profiloUtente/profiloAnziano.php';
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var vars = "id=1"; //+ localStorage["id"]; bisogna passare l'id dell'anziano in altri modi

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(http.responseText);
            var result = JSON.parse(http.responseText);

            document.getElementById('nome').innerHTML = result['0']['nome'];
            document.getElementById('cognome').innerHTML = result['0']['cognome'];
            //document.getElementById('nascita').innerHTML = result['0']['nome'];
            document.getElementById('telefono').innerHTML = result['0']['telefono'];
            document.getElementById('email').innerHTML = result['0']['email'];
        }
      };

      http.send(vars);
      
 /* } else if(localStorage["tipoUtente" == "anziano"]){
      const url= ip + '/profiloUtente/profiloOfferente.php';
      var http = new XMLHttpRequest();
      http.open("POST", url, true);
      http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      var vars = "id=1"; //+ localStorage["id"]; bisogna passare l'id dell'offerente in altri modi

      http.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              console.log(http.responseText);
              var result = JSON.parse(http.responseText);

              document.getElementById('nome').innerHTML = result['0']['nome'];
              document.getElementById('cognome').innerHTML = result['0']['cognome'];
              //document.getElementById('nascita').innerHTML = result['0']['nome'];
              document.getElementById('telefono').innerHTML = result['0']['telefono'];
              document.getElementById('email').innerHTML = result['0']['email'];
          }
        };

        http.send(vars);
 }*/

  
