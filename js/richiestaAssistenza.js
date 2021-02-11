var messaggio = localStorage["messaggioAssistenza"];
if(messaggio){
  document.getElementById("divModal").innerHTML += `
  <div class="modal fade" tabindex="-1" id="modalMessaggio" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">` + messaggio + `</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
        </div>
      </div>
    </div>
  </div>
  `;
  var myModal = new bootstrap.Modal(document.getElementById('modalMessaggio'), {
  keyboard: false
  });
  myModal.toggle()
  localStorage["messaggioAssistenza"] = "";
}


function richiestaAssistenza(){
  const url= ip + '/inviaMailAssistenza.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  var selectCategoria = document.getElementById("selectCategoria");
  var categoria = selectCategoria.options[selectCategoria.selectedIndex].text;
  var messaggio = document.getElementById("messaggio").value;
  var vars = "id=" + localStorage["id"] + "&tipoUtente=" + localStorage["tipoUtente"] +
   "&categoria=" + categoria + "&messaggio=" + messaggio;
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if(http.responseText == "sent"){
        localStorage.setItem("messaggioAssistenza", "La richiesta di assistenza e' stata inviata");
        window.location.href='assistenzaClienti.html';
      }else
        console.log("Error");
    }
  };
  http.send(vars);
}
