var ip = "http://www.gograndpa.altervista.org";

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown() {
  window.location.href = "login.html";
}
