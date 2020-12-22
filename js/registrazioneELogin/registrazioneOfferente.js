var zone = [];
var nZone = 1;
var fasce = [];

function showZone(){
  document.getElementById("dati").style.display = "none";
  document.getElementById("zone").style.display = "block";
}

function addZona(){
  nZone ++;
  var zonaHTML = '<div class="mb-3">';
  zonaHTML += '<label id="label' + nZone + '" for="nome" class="form-label">Città ' + nZone + '</label>'
  zonaHTML += '<input type="text" class="form-control" id="nome1' + nZone + '">';
  zonaHTML += '</div>';

  document.getElementById("listaZone").innerHTML += zonaHTML;
}

function showServizi(){
  document.getElementById("zone").style.display = "none";
  document.getElementById("servizi").style.display = "block";
}

function showFasce(){
  document.getElementById("servizi").style.display = "none";
  document.getElementById("fasce").style.display = "block";
}

function register(){
  document.getElementById('error').innerHTML = "";
  var nome = document.getElementById('nome').value;
  var cognome = document.getElementById('cognome').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var telefono = document.getElementById('telefono').value;
  var indirizzo = document.getElementById('indirizzo').value;
  var città = document.getElementById('città').value;

  const url= ip + '/registrazioneLogin/registrazioneAnziano.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var vars = "nome=" + nome + "&cognome=" + cognome + "&email=" + email + "&password=" + password + "&telefono=" + telefono + "&indirizzo=" + indirizzo + "&città=" + città;
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if(http.responseText == "existing"){
        document.getElementById('error').innerHTML = "Utente già esistente";
      }else if(http.responseText == "queryError"){
        document.getElementById('error').innerHTML = "Errore interno";
      }
      else if(http.responseText == "ok"){
        window.location.href = "index.html";
      }
    }
  };
  http.send(vars);
}
