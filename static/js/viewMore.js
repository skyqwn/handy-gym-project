"use strict";

var viewMoreBtn = document.getElementById("viewMore");
var modalContainer = document.querySelector(".modalContainer");
var modal = document.querySelector(".modal");
var xBtn = document.querySelector("#xBtn");
var body = document.querySelector("body");

var slideContainer = document.querySelector(".slideContainer");
var imgs = document.querySelectorAll(".gymImg");
var nextBtn = document.getElementById("nextSlide");
var prevBtn = document.getElementById("prevSlide");

var modalOpen = function modalOpen() {
  modalContainer.style.transform = "translateY(0)";
  modalContainer.style.opacity = "1";
  modal.style.top = window.scrollY + "px";
  body.style.overflowY = "hidden";
};

var modalClose = function modalClose() {
  modalContainer.style.transform = "translateY(-100%)";
  modalContainer.style.opacity = "0";
  body.style.overflowY = "scroll";
};

var SLIDE_INDEX = 0;

var paintImgsSlide = function paintImgsSlide(index) {
  for (var i = 0; i < imgs.length; i++) {
    if (index === i) {
      imgs[i].style.display = "block";
    } else {
      imgs[i].style.display = "none";
    }
  }
  // const percent = -100 * index;
  // slideContainer.style.transform = `translateX(${percent}%)`;
};

var handleNext = function handleNext() {
  if (SLIDE_INDEX === imgs.length - 1) {
    SLIDE_INDEX = 0;
  } else {
    SLIDE_INDEX++;
  }
  paintImgsSlide(SLIDE_INDEX);
};

var handlePrev = function handlePrev() {
  if (SLIDE_INDEX <= 0) {
    SLIDE_INDEX = imgs.length - 1;
  } else {
    SLIDE_INDEX--;
  }
  paintImgsSlide(SLIDE_INDEX);
};

// if (imgs.length > 0) {
//   init();
// }

var init = function init() {
  paintImgsSlide(SLIDE_INDEX);
  viewMoreBtn.addEventListener("click", modalOpen);
  xBtn.addEventListener("click", modalClose);
  nextBtn.addEventListener("click", handleNext);
  prevBtn.addEventListener("click", handlePrev);
};

init();