"use strict";

var menuBar = document.querySelector(".menubar");
var menuModal = document.querySelector(".menuModal");
var navLinks = document.querySelectorAll(".navLink");

var closeHandler = function closeHandler(e) {
  var isModalClick = menuModal.contains(e.target) || menuBar.contains(e.target);
  if (!isModalClick) {
    if (!menuModal.classList.contains("hidden")) {
      menuModal.classList.add("hidden");
    }
  }
};

var openHandler = function openHandler() {
  menuModal.classList.toggle("hidden");
};

var init = function init() {
  menuBar.addEventListener("click", openHandler);
  document.addEventListener("click", closeHandler);
};

for (var i = 0; i < navLinks.length; i++) {
  var href = window.location.href;
  var aTag = navLinks[i];
  var aHref = aTag.href;
  if (href === aHref) {
    aTag.style.color = "blue";
    aTag.style.fontWeight = "700";
    aTag.style.textDecoration = "underline";
  }
}

init();