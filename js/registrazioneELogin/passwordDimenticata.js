var email;
function inviaCodiceRecupero(){
  email = document.getElementById("email").value;
  confermaEmail = document.getElementById("conferma-email").value;

  if(email == confermaEmail){
    const url= ip + 'registrazioneLogin/passwordDimenticata.php';
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    var vars = "email=" + email;
    http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        localStorage.setItem("codice", http.responseText);
      }
    };
    http.send(vars);

    hideDiv("form-login", "inviaCodice"); //Va al div dove si può inserire il codice
  }else{
    document.getElementById("error1").innerHTML = "Le email non corrispondono";
  }
}


function controllaCodice(){
  var codiceInserito = document.getElementById("codice").value;
  var codiceCorretto = localStorage["codice"];

  if(codiceInserito == codiceCorretto){
    hideDiv("inviaCodice", "inserisciPassword"); //Va al div dove permette di inserire la nuova password
  }else{
    document.getElementById("error2").innerHTML = "Codice non corretto, riprovare";
  }
}

function inviaNuovaPassword(){
  password = document.getElementById("password").value;
  confermaPassword = document.getElementById("conferma-password").value;

  if(password == confermaPassword){
    const url= ip + 'registrazioneLogin/passwordDimenticata.php';
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    var vars = "email=" + email + "&password=" + document.getElementById("password").value + "&tipoUtente=" + document.getElementById("selectTipo").value;
    console.log(vars);
    http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if(http.responseText == "ok"){
          hideDiv("inserisciPassword", "finale"); //Va al div dove si conferma il cambio e c'è un tasto per tornare al login
        }else{
          console.log(http.responseText);
        }
      }
    };
    http.send(vars);
  }else{
    document.getElementById("error3").innerHTML = "Le password non corrispondono";
  }
}
