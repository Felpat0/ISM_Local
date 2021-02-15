const url= ip + '/profiloUtente/modificaProfiloUtente.php';
var http = new XMLHttpRequest();
http.open("POST", url, true);
http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
var vars = "action=GET&id="+localStorage['id']+"&tipoUtente="+localStorage['tipoUtente'];

http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var result = JSON.parse(http.responseText);
        var tipo;
        console.log(result);
        if(localStorage.getItem('tipoUtente') == 'anziano') {tipo = 'Anziano';}
        else {tipo = 'Offerente';}
        document.getElementById('nome').value = result['0']['nome'+tipo];
        document.getElementById('cognome').value = result['0']['cognome'+tipo];
        if(localStorage.getItem('tipoUtente')=='anziano'){
            document.getElementById('indirizzo').value = result['0']['indirizzo'];
            document.getElementById('città').value = result['0']['città'];
            document.getElementById('linksOfferente').innerHTML = "";
        }else{
          document.getElementById('divAnziano').innerHTML = "";
        }
        document.getElementById('telefono').value = result['0']['telefono'+tipo];
        document.getElementById('email').value = result['0']['email'+tipo];
    }
};
http.send(vars);

function validateEmail(email) {
  //Check if the email address is valid
  const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return res.test(String(email).toLowerCase());
}

function enableModifiche(){
  document.getElementById('nome').disabled = false;
  document.getElementById('cognome').disabled = false;
  if(localStorage.getItem('tipoUtente')=='anziano'){
      document.getElementById('indirizzo').disabled = false;
      document.getElementById('città').disabled = false;
  }
  document.getElementById('telefono').disabled = false;
  document.getElementById('email').disabled = false;
  document.getElementById("linksGenerici").innerHTML = '<a id="modifica-profilo" onclick="inviaModifiche()" href="#">Invia modifiche</a><br/>';
}

function inviaModifiche(){
  //Recupera dati
  var nome = document.getElementById('nome').value;
  var cognome = document.getElementById('cognome').value;
  var telefono = document.getElementById('telefono').value;
  var email = document.getElementById('email').value;
  var indirizzo;
  var città;
  if(nome && cognome && telefono && validateEmail(email)){
    var ok = true;
    if(localStorage.getItem('tipoUtente') == 'anziano'){
      indirizzo = document.getElementById('indirizzo').value;
      città = document.getElementById('città').value;
      if(!indirizzo || !città)
        ok = false;
    }
    if(ok){
      var vars = "action=SET&id="+localStorage['id']+"&tipoUtente="+localStorage['tipoUtente'];
      vars += "&nome=" + nome;
      vars += "&cognome=" + cognome;
      vars += "&telefono=" + telefono;
      vars += "&email=" + email;
      const url= ip + '/profiloUtente/modificaProfiloUtente.php';
      var http = new XMLHttpRequest();
      http.open("POST", url, true);
      http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      if(localStorage.getItem('tipoUtente') == 'anziano'){
        vars += "&indirizzo=" + indirizzo;
        vars += "&città=" + città;
      }
      http.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              if(http.responseText == "ok"){
                localStorage.setItem("messaggioHome", "Le modifiche sono state apportate");
                if(localStorage["tipoUtente"] == "anziano")
                  window.location.href = "homeanziano.html";
                else
                  window.location.href = "homeutente.html";
              }
          }
      };
      http.send(vars);
    }else{
      document.getElementById("error").innerHTML = "E' necessario riempire tutti i campi";
    }
  }else{
    if(!validateEmail(email)){
      document.getElementById("error").innerHTML = "L'indirizzo email inserito non è valido";
    }else{
      document.getElementById("error").innerHTML = "E' necessario riempire tutti i campi";
    }
  }
}
