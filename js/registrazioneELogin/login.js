function login(){
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
      console.log(http.responseText);
      if(http.responseText == "wrongEmail"){
        document.getElementById('error').innerHTML = "L'utente non esiste";
      }else if(http.responseText == "wrongPassword"){
        document.getElementById('error').innerHTML = "Password errata";
      }else if(http.responseText == "queryError"){
        document.getElementById('error').innerHTML = "Errore interno";
      }else if(http.responseText == "okAnziano" || http.responseText == "okOfferente"){
        if(http.responseText == "okAnziano"){
          document.getElementById('error').innerHTML = "Anziano";
        }else{
          document.getElementById('error').innerHTML = "Offerente";
        }
        //window.location.href = "index.html";
      }
    }
  };
  http.send(vars);
}
