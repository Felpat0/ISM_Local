var html = `
<div id="logo">
  <img id="logo" src="img/logoGG.png">
</div>
<div id="barra">
  <ul id="menu">
    <li><a id="home"><img id="icona" src="img/home.png"></a></li>
    <li><a id="notifica" onclick="window.location.href = 'notifiche.html'"><img id="icona" src="img/notifica.png"></a>
    <!-- <a><img id="icona" src="img/nuovanotifica.png"></a> --></li>
    <li><a id="messaggio" onclick="window.location.href = 'chat.html'"><img id="icona" src="img/messaggio.png"></a></li>
    <li><a id="profilo"><img id="icona" src="img/account.png"></a> </li>
    <li> <a id="logout"><img id="icona" src="img/logout.png"></a></li>
  </ul>
</div>
<button onclick="" id="back"><</button> `;

document.getElementById('testa').innerHTML = html;

var fileName = location.href.split("/").slice(-1);

if(fileName == 'homeanziano.html' || fileName == 'homeutente.html'){
  var backButton = document.getElementById('back');
  backButton.remove();
}

if(localStorage.getItem('tipoUtente') == 'offerente'){
  document.getElementById('home').setAttribute("onclick", "window.location.href = 'homeofferente.html'");
} else {
  document.getElementById('home').setAttribute("onclick", "window.location.href = 'homeanziano.html'");
}
