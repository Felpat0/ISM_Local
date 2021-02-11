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
  var vars = "action=SET&id="+localStorage['id']+"&tipoUtente="+localStorage['tipoUtente'];
  vars += "&nome=" + document.getElementById('nome').value;
  vars += "&cognome=" + document.getElementById('cognome').value;
  vars += "&telefono=" + document.getElementById('telefono').value;
  vars += "&email=" + document.getElementById('email').value;
  const url= ip + '/profiloUtente/modificaProfiloUtente.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  if(localStorage.getItem('tipoUtente')=='anziano'){
    vars += "&indirizzo=" + document.getElementById('indirizzo').value;
    vars += "&città=" + document.getElementById('città').value;
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
}
