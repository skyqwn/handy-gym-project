"use strict";

var viewMoreBtn = document.getElementById("viewMore");
var viewMoreContainer = document.querySelector(".viewMoreContainer");
var viewMore = document.querySelector(".viewMore");
var body = document.querySelector("body");
var xBtn = document.getElementById("xBtn");

var imgs = void 0;
var nextBtn = void 0;
var prevBtn = void 0;

var isPhone = Boolean(window.innerWidth < 758);

if (isPhone) {
  imgs = document.querySelectorAll(".phoneImg");
  nextBtn = document.getElementById("phoneNextBtn");
  prevBtn = document.getElementById("phonePrevBtn");
} else {
  imgs = document.querySelectorAll(".gymImg");
  nextBtn = document.getElementById("nextSlideBtn");
  prevBtn = document.getElementById("prevSlideBtn");
}

var SLIDE_INDEX = 0;

var modalOpen = function modalOpen() {
  viewMoreContainer.style.transform = "translateY(0)";
  viewMoreContainer.style.opacity = 1;
  viewMore.style.top = window.scrollY + "px";
  body.style.overflowY = "hidden";
};

var modalClose = function modalClose() {
  viewMoreContainer.style.transform = "translateY(-100%)";
  viewMoreContainer.style.opacity = 0;
  body.style.overflowY = "scroll";
};

var paintImgsSlide = function paintImgsSlide(index) {
  var slideNumber = document.getElementById("slideNumber");
  for (var i = 0; i < imgs.length; i++) {
    if (i === index) {
      imgs[i].style.opacity = 1;
      slideNumber.innerText = i + 1 + " /" + imgs.length;
    } else {
      imgs[i].style.opacity = 0;
    }
  }
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
  if (SLIDE_INDEX === 0) {
    SLIDE_INDEX = imgs.length - 1;
  } else {
    SLIDE_INDEX--;
  }
  paintImgsSlide(SLIDE_INDEX);
};

var init = function init() {
  paintImgsSlide(SLIDE_INDEX);
  viewMoreBtn.addEventListener("click", modalOpen);
  xBtn.addEventListener("click", modalClose);
  nextBtn.addEventListener("click", handleNext);
  prevBtn.addEventListener("click", handlePrev);
};

if (viewMoreBtn) {
  init();
}