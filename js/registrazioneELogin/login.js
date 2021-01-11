var button = document.querySelector("#submit");
button.addEventListener("click", function () {
  button.classList.add("loading");
  document.getElementById("label").style.visibility = "hidden";
});

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
      if(http.responseText == "wrongEmail"){
        document.getElementById('error').innerHTML = "L'utente non esiste";
      }else if(http.responseText == "wrongPassword"){
        document.getElementById('error').innerHTML = "Password errata";
      }else if(http.responseText == "queryError"){
        document.getElementById('error').innerHTML = "Errore interno";
      }else if(http.responseText.includes("okAnziano") || http.responseText.includes("okOfferente")){
        if(http.responseText.includes("okAnziano")){
          document.getElementById('error').innerHTML = "Anziano";
          //Ricavare l'id anziano dalla risposta del server
          var matches = http.responseText.match(/(\d+)/);
      		var idAnziano = matches[0];
          //Salvare id, email e tipoUtente
          localStorage.setItem("id", idAnziano);
          localStorage.setItem("email", email);
          localStorage.setItem("tipoUtente", "anziano");
          window.location.href = "homeanziano.html";
        }else{
          document.getElementById('error').innerHTML = "Offerente";
          //Ricavare l'id offerente dalla risposta del server
          var matches = http.responseText.match(/(\d+)/);
      		var idOfferente = matches[0];
          //Salvare id, email e tipoUtente
          localStorage.setItem("id", idOfferente);
          localStorage.setItem("email", email);
          localStorage.setItem("tipoUtente", "offerente");
          window.location.href = "homeofferente.html";
        }

      }
    }
  };
  http.send(vars);
}
