function validateEmail(email) {
  //Check if the email address is valid
  const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return res.test(String(email).toLowerCase());
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
  document.getElementById("error").innerHTML = "";
  if(nome && cognome && validateEmail(email) && password && telefono && indirizzo && città){
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
          localStorage.setItem("messaggioLogin", "La registrazione è stata effettuata con successo");
          window.location.href = "login.html";
        }else{
          console.log(http.responseText);
        }
      }
    };
    http.send(vars);
  }else{
    if(!validateEmail(email)){
      document.getElementById("error").innerHTML = "L'indirizzo email inserito non è valido";
    }else{
      document.getElementById("error").innerHTML = "E' necessario riempire tutti i campi";
    }
  }
}
