
  
  //localStorage.setItem('tipoUtente', 'anziano');
  
    if(localStorage.getItem('tipoUtente') == 'offerente'){ //controllo se l'utente è offerente
      const url= ip + '/profiloUtente/profiloAnziano.php';
      var http = new XMLHttpRequest();
      http.open("POST", url, true);
      http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      var vars = "id="+localStorage['idUtente']; 

      http.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              console.log(http.responseText);
              var result = JSON.parse(http.responseText);

              document.getElementById('nome').innerHTML = result['0']['nomeAnziano'];
              document.getElementById('cognome').innerHTML = result['0']['cognomeAnziano'];
              document.getElementById('indirizzo').innerHTML = result['0']['indirizzo'];
              document.getElementById('telefono').innerHTML = result['0']['telefonoAnziano'];
              document.getElementById('email').innerHTML = result['0']['emailAnziano'];
          }
        };

        http.send(vars);
        
    } else if(localStorage.getItem('tipoUtente') == 'anziano'){ //controllo se l'utente è anziano
        const url= ip + '/profiloUtente/profiloOfferente.php';
        var http = new XMLHttpRequest();
        http.open("POST", url, true);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var vars = "id="+localStorage['idUtente']; 
        http.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(http.responseText);
                var result = JSON.parse(http.responseText);

                document.getElementById('nome').innerHTML = result['0']['nomeOfferente'];
                document.getElementById('cognome').innerHTML = result['0']['cognomeOfferente'];
                document.getElementById('telefono').innerHTML = result['0']['telefonoOfferente'];
                document.getElementById('email').innerHTML = result['0']['emailOfferente'];
            }
          };

          http.send(vars);
  }
