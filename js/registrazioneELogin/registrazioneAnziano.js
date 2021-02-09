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
      document.getElementById('error').innerHTML = http.responseText;
      if(http.responseText == "existing"){
        document.getElementById('error').innerHTML = "Utente già esistente";
      }else if(http.responseText == "queryError"){
        document.getElementById('error').innerHTML = "Errore interno";
      }
      else if(http.responseText == "ok"){
        window.location.href = "login.html";
      }
    }
  };
  http.send(vars);
}
