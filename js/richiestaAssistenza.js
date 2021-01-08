function richiestaAssistenza(){
  const url= ip + '/assistenza/inviaMail.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //SETTO UN ID TEMPORANEO A CASO, DA ELIMINARE
  localStorage.setItem("id", 1);
  localStorage.setItem("tipoUtente", "anziano")

  var selectCategoria = document.getElementById("selectCategoria");
  var categoria = selectCategoria.options[selectCategoria.selectedIndex].text;
  var messaggio = document.getElementById("messaggio").value;
  var vars = "id=" + localStorage["id"] + "&tipoUtente=" + localStorage["tipoUtente"] +
   "&categoria=" + categoria + "&messaggio=" + messaggio;
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if(http.responseText == "sent"){
        //Far vedere un modal e poi tornare alla home
      }else
        console.log("Error");
    }
  };
  http.send(vars);
}
