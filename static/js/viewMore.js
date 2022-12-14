"use strict";

var viewMoreBtn = document.getElementById("viewMore");
var viewMoreContainer = document.querySelector(".viewMoreContainer");
var viewMore = document.querySelector(".viewMore");
var xBtn = document.querySelector("#xBtn");
var body = document.querySelector("body");

var slideContainer = document.querySelector(".slideContainer");
var imgs = document.querySelectorAll(".gymImg");
var nextBtn = document.getElementById("nextSlide");
var prevBtn = document.getElementById("prevSlide");
var slideNumber = document.getElementById("slideNumber");

var modalOpen = function modalOpen() {
  viewMoreContainer.style.transform = "translateY(0)";
  viewMoreContainer.style.opacity = "1";
  viewMore.style.top = window.scrollY + "px";
  body.style.overflowY = "hidden";
};

var modalClose = function modalClose() {
  viewMoreContainer.style.transform = "translateY(-100%)";
  viewMoreContainer.style.opacity = "0";
  body.style.overflowY = "scroll";
};

var SLIDE_INDEX = 0;

var paintImgsSlide = function paintImgsSlide(index) {
  for (var i = 0; i < imgs.length; i++) {
    if (index === i) {
      imgs[i].style.opacity = "1";
      slideNumber.innerText = i + 1 + "  / " + imgs.length;
    } else {
      imgs[i].style.opacity = "0";
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