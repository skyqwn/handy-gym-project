"use strict";

window.addEventListener("beforeunload", function (event) {
  event.preventDefault();
  event.returnValue = "나가면 다시써야댐";
});