var calendar = document.getElementById("calendar-table");
var gridTable = document.getElementById("table-body");
var currentDate = new Date();
var selectedDate = currentDate;
var selectedDayBlock = null;
var globalEventObj = {};


var sidebar = document.getElementById("sidebar");

function createCalendar(date, side) {
   var currentDate = date;
   var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

   var monthTitle = document.getElementById("month-name");
   var monthName = currentDate.toLocaleString("it-IT", {
      month: "long"
   });
   var yearNum = currentDate.toLocaleString("it-IT", {
      year: "numeric"
   });
   monthTitle.innerHTML = `${monthName} ${yearNum}`;

   if (side == "left") {
      gridTable.className = "animated fadeOutRight";
   } else {
      gridTable.className = "animated fadeOutLeft";
   }

   setTimeout(() => {
      gridTable.innerHTML = "";

      var newTr = document.createElement("div");
      newTr.className = "row";
      var currentTr = gridTable.appendChild(newTr);

      for (let i = 1; i < startDate.getDay(); i++) {
         let emptyDivCol = document.createElement("div");
         emptyDivCol.className = "col empty-day";
         currentTr.appendChild(emptyDivCol);
      }

      var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      lastDay = lastDay.getDate();

      for (let i = 1; i <= lastDay; i++) {
         if (currentTr.children.length >= 7) {
            currentTr = gridTable.appendChild(addNewRow());
         }
         let currentDay = document.createElement("div");
         currentDay.className = "col";
         if (selectedDayBlock == null && i == currentDate.getDate() || selectedDate.toDateString() == new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toDateString()) {
            selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);

            document.getElementById("eventDayName").innerHTML = selectedDate.toLocaleString("it-IT", {
               month: "long",
               day: "numeric",
               year: "numeric"
            });

         }
         currentDay.innerHTML = i;

         //show marks
         if (globalEventObj[new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toDateString()]) {
            let eventMark = document.createElement("div");
            eventMark.className = "day-mark";
            currentDay.appendChild(eventMark);
         }

         currentTr.appendChild(currentDay);
      }

      for (let i = currentTr.getElementsByTagName("div").length; i < 7; i++) {
         let emptyDivCol = document.createElement("div");
         emptyDivCol.className = "col empty-day";
         currentTr.appendChild(emptyDivCol);
      }

      if (side == "left") {
         gridTable.className = "animated fadeInLeft";
      } else {
         gridTable.className = "animated fadeInRight";
      }

      function addNewRow() {
         let node = document.createElement("div");
         node.className = "row";
         return node;
      }

   }, !side ? 0 : 270);
}

//-----------------------------------------------------------------------------------------------------
function loadJSONPrenotazioni(){
  const url= ip + '/queryOfferente/getPrenotazioni.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var vars = "idOfferente=" + localStorage["id"];
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      prenotazioni = JSON.parse(http.responseText);
      loadPrenotazioniAttive();
      createCalendar(currentDate);
    }
  };
  http.send(vars);
}

loadJSONPrenotazioni();

function addEvent(title, desc) {
   if (!globalEventObj[selectedDate.toDateString()]) {
      globalEventObj[selectedDate.toDateString()] = {};
   }
   globalEventObj[selectedDate.toDateString()][title] = desc;
}

function addEvent(date, title, desc) {
   if (!globalEventObj[date]) {
      globalEventObj[date] = {};
   }
   globalEventObj[date][title] = desc;
}

function loadPrenotazioniAttive(){
  //Scrivere la lista delle prenotazioni attive
  for(i = 0; i != prenotazioni["prenotazioni"].length; i++){
    if(prenotazioni["prenotazioni"][i]["stato"] == "accettata"){
      var data = new Date(prenotazioni["prenotazioni"][i]["data"]);
      data = data.toDateString();
      var titolo = listaServizi[prenotazioni["prenotazioni"][i]["idServizio"]];
      var descrizione = "Servizio per " + prenotazioni["prenotazioni"][i]["nomeAnziano"] + " " + prenotazioni["prenotazioni"][i]["cognomeAnziano"] + " alle " + prenotazioni["prenotazioni"][i]["ora"];
      addEvent(data, titolo, descrizione);
    }
  }
  //Scrivere la lista delle prenotazioni attive derivanti da preventivo
  if(prenotazioni["preventiviAttivi"]){
    for(i = 0; i != prenotazioni["preventiviAttivi"].length; i++){
    var data = new Date(prenotazioni["preventiviAttivi"][i]["data"]);
    data = data.toDateString();
    var titolo = listaServizi[prenotazioni["preventiviAttivi"][i]["idServizio"]];
    var descrizione = "Servizio per " + prenotazioni["preventiviAttivi"][i]["nomeAnziano"] + " " + prenotazioni["preventiviAttivi"][i]["cognomeAnziano"] + " alle " + prenotazioni["preventiviAttivi"][i]["ora"];
    addEvent(data, titolo, descrizione);
    /*
        element = "";
        element += '<div>';
        element += '<button onclick="showRiepilogoPreventivoAttivo(' + i + ')" class="prenotazione">';
        element += '<h2>' + prenotazioni["preventiviAttivi"][i]["nomeAnziano"] + " " + prenotazioni["preventiviAttivi"][i]["cognomeAnziano"] + '</h2>'
        element += '<h3>' + listaServizi[prenotazioni["preventiviAttivi"][i]["idServizio"]] + '</h3>';
        element += '</button>';
        element += '<a href="#" class="linkprofilo" onclick="apriProfiloAnziano(' + prenotazioni["preventiviAttivi"][i]["idAnziano"] + ')">Visualizza profilo</a>';
        element += '</div>';
        document.getElementById("prenotazioniAttive").innerHTML += element;*/
    }
  }
}


//-----------------------------------------------------------------------------------------------------




var todayDayName = document.getElementById("todayDayName");
todayDayName.innerHTML = "Oggi è " + currentDate.toLocaleString("it-IT", {
   weekday: "long",
   day: "numeric",
   month: "short"
});

var prevButton = document.getElementById("prev");
var nextButton = document.getElementById("next");

prevButton.onclick = function changeMonthPrev() {
   currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
   createCalendar(currentDate, "left");
}
nextButton.onclick = function changeMonthNext() {
   currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
   createCalendar(currentDate, "right");
}


function showEvents() {
   let sidebarEvents = document.getElementById("sidebarEvents");
   let objWithDate = globalEventObj[selectedDate.toDateString()];

   sidebarEvents.innerHTML = "";

   if (objWithDate) {
      let eventsCount = 0;
      for (key in globalEventObj[selectedDate.toDateString()]) {
         let eventContainer = document.createElement("div");
         eventContainer.className = "eventCard";

         let eventHeader = document.createElement("div");
         eventHeader.className = "eventCard-header";

         let eventDescription = document.createElement("div");
         eventDescription.className = "eventCard-description";

         let eventClock = document.createElement("div");
         eventClock.className = "eventCard-clock";

         eventHeader.appendChild(document.createTextNode(key));
         eventContainer.appendChild(eventHeader);

         eventDescription.appendChild(document.createTextNode(objWithDate[key]));
         eventContainer.appendChild(eventDescription);

         let markWrapper = document.createElement("div");
         markWrapper.className = "eventCard-mark-wrapper";
         let mark = document.createElement("div");
         mark.classList = "eventCard-mark";
         markWrapper.appendChild(mark);
         eventContainer.appendChild(markWrapper);

         sidebarEvents.appendChild(eventContainer);

         eventsCount++;
      }
      let emptyFormMessage = document.getElementById("emptyFormTitle");
      emptyFormMessage.innerHTML = `Eventi nella giornata selezionata: ${eventsCount}`;
   } else {
      let emptyMessage = document.createElement("div");
      emptyMessage.className = "empty-message";
      emptyMessage.innerHTML = "Non ci sono eventi nella data selezionata";
      sidebarEvents.appendChild(emptyMessage);
      let emptyFormMessage = document.getElementById("emptyFormTitle");
      emptyFormMessage.innerHTML = "Non ci sono eventi";
   }
}

gridTable.onclick = function (e) {

   if (!e.target.classList.contains("col") || e.target.classList.contains("empty-day")) {
      return;
   }

   if (selectedDayBlock) {
      if (selectedDayBlock.classList.contains("green") && selectedDayBlock.classList.contains("lighten-3")) {
         selectedDayBlock.classList.remove("green");
         selectedDayBlock.classList.remove("lighten-3");
      }
   }
   selectedDayBlock = e.target;
   selectedDayBlock.classList.add("green");
   selectedDayBlock.classList.add("lighten-3");

   selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(e.target.innerHTML));

   showEvents();

   document.getElementById("eventDayName").innerHTML = selectedDate.toLocaleString("it-IT", {
      month: "long",
      day: "numeric",
      year: "numeric"
   });

}

var changeFormButton = document.getElementById("changeFormButton");
var addForm = document.getElementById("addForm");
changeFormButton.onclick = function (e) {
   addForm.style.top = 0;
}

var cancelAdd = document.getElementById("cancelAdd");
cancelAdd.onclick = function (e) {
   addForm.style.top = "100%";
   let inputs = addForm.getElementsByTagName("input");
   for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
   }
   let labels = addForm.getElementsByTagName("label");
   for (let i = 0; i < labels.length; i++) {
      labels[i].className = "";
   }
}

var addEventButton = document.getElementById("addEventButton");
addEventButton.onclick = function (e) {
   let title = document.getElementById("eventTitleInput").value.trim();
   let desc = document.getElementById("eventDescInput").value.trim();

   if (!title || !desc) {
      document.getElementById("eventTitleInput").value = "";
      document.getElementById("eventDescInput").value = "";
      let labels = addForm.getElementsByTagName("label");
      for (let i = 0; i < labels.length; i++) {
         labels[i].className = "";
      }
      return;
   }

   addEvent(title, desc);
   showEvents();

   if (!selectedDayBlock.querySelector(".day-mark")) {
      selectedDayBlock.appendChild(document.createElement("div")).className = "day-mark";
   }

   let inputs = addForm.getElementsByTagName("input");
   for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
   }
   let labels = addForm.getElementsByTagName("label");
   for (let i = 0; i < labels.length; i++) {
      labels[i].className = "";
   }

}
