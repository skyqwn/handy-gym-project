"use strict";

var createdTexts = document.querySelectorAll(".postCreatedAt");

function dateFormat(createdEl) {
  var rawText = createdEl.innerText;

  var createdDate = new Date(rawText);
  var createdYear = createdDate.getFullYear();
  var createdMonth = createdDate.getMonth() + 1;
  var createdDay = createdDate.getDate();

  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth() + 1;
  var currentDay = currentDate.getDate();

  if (createdYear === currentYear && createdMonth === currentMonth && createdDay === currentDay) {
    var createdHour = createdDate.getHours();
    var currentHour = currentDate.getHours();
    var subtractHour = currentHour - createdHour;
    if (createdHour === currentHour) {
      var createdMin = createdDate.getMinutes();
      var currentMin = currentDate.getMinutes();
      var subtractMin = currentMin - createdMin;
      if (createdMin === currentMin) {
        var createdSec = createdDate.getSeconds();
        var currentSec = currentDate.getSeconds();
        var subtractSec = currentSec - createdSec;
        createdEl.innerText = subtractSec + "\uCD08\uC804";
        return;
      }
      createdEl.innerText = subtractMin + "\uBD84\uC804";
      return;
    }
    createdEl.innerText = subtractHour + "\uC2DC\uAC04\uC804";
    return;
  }

  createdEl.innerText = createdYear + "." + createdMonth + "." + createdDay;
}

for (var i = 0; i < createdTexts.length; i++) {
  dateFormat(createdTexts[i]);
}