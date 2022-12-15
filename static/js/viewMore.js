"use strict";

var viewMoreBtn = document.getElementById("viewMore");
var modal = document.querySelector(".modal");
var modalNext = document.querySelector(".modal__body__next");
var xBtn = document.querySelector(".xBtn");

var modalOpen = function modalOpen() {
  modal.style.display = "block";
};

var modalClose = function modalClose() {
  modal.style.display = "none";
};

var init = function init() {
  viewMoreBtn.addEventListener("click", modalOpen);
  xBtn.addEventListener("click", modalClose);
};

init();