function inviaCodiceRecupero(){
  //var mail = document.getElementById("").text;
  var mail = "felpatochannel@gmail.com";

  const url= ip + 'registrazioneLogin/passwordDimenticata.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  var vars = "email=" + mail;
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      localStorage.setItem("codice", http.responseText);
      //hideDiv(); //Va al div dove si può inserire il codice
    }
  };
  http.send(vars);
}

inviaCodiceRecupero();

function controllaCodice(){
  //var codiceInserito = document.getElementById("").text;
  var codiceInserito = localStorage["codice"];
  var codiceCorretto = localStorage["codice"];

  if(codiceInserito == codiceCorretto){
    //hideDiv(); //Va al div dove permette di inserire la nuova password
  }else{
    //document.getElementById("").innerHTML = "Codice non corretto, riprovare";
  }
}

function inviaNuovaPassword(){
  const url= ip + 'registrazioneLogin/passwordDimenticata.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  var vars = "password=" + document.getElementById("").text;
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if(http.responseText == "ok"){
        //hideDiv(); //Va al div dove si conferma il cambio e c'è un tasto per tornare al login
      }else{
        console.log(http.responseText);
      }
    }
  };
  http.send(vars);
}
