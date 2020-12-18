function register(){
  document.getElementById('error').innerHTML = "";
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  const url= ip + '/registrazioneLogin/login.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var vars = "email=" + email + "&password=" + password;
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
