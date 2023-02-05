const viewMoreBtn = document.getElementById("viewMore");
const viewMoreContainer = document.querySelector(".viewMoreContainer");
const viewMore = document.querySelector(".viewMore");
const body = document.querySelector("body");
const xBtn = document.getElementById("xBtn");

let imgs;
let nextBtn;
let prevBtn;

const isPhone = Boolean(window.innerWidth < 758);

if (isPhone) {
  imgs = document.querySelectorAll(".phoneImg");
  nextBtn = document.getElementById("phoneNextBtn");
  prevBtn = document.getElementById("phonePrevBtn");
} else {
  imgs = document.querySelectorAll(".gymImg");
  nextBtn = document.getElementById("nextSlideBtn");
  prevBtn = document.getElementById("prevSlideBtn");
}

let SLIDE_INDEX = 0;

const modalOpen = () => {
  viewMoreContainer.style.transform = "translateY(0)";
  viewMoreContainer.style.opacity = 1;
  viewMore.style.top = `${window.scrollY}px`;
  body.style.overflowY = "hidden";
};

const modalClose = () => {
  viewMoreContainer.style.transform = "translateY(-100%)";
  viewMoreContainer.style.opacity = 0;
  body.style.overflowY = "scroll";
};

const paintImgsSlide = (index) => {
  const slideNumber = document.getElementById("slideNumber");
  for (let i = 0; i < imgs.length; i++) {
    if (i === index) {
      imgs[i].style.opacity = 1;
      slideNumber.innerText = `${i + 1} /${imgs.length}`;
    } else {
      imgs[i].style.opacity = 0;
    }
  }
};

const handleNext = () => {
  if (SLIDE_INDEX === imgs.length - 1) {
    SLIDE_INDEX = 0;
  } else {
    SLIDE_INDEX++;
  }
  paintImgsSlide(SLIDE_INDEX);
};

const handlePrev = () => {
  if (SLIDE_INDEX === 0) {
    SLIDE_INDEX = imgs.length - 1;
  } else {
    SLIDE_INDEX--;
  }
  paintImgsSlide(SLIDE_INDEX);
};

const init = () => {
  paintImgsSlide(SLIDE_INDEX);
  viewMoreBtn.addEventListener("click", modalOpen);
  xBtn.addEventListener("click", modalClose);
  nextBtn.addEventListener("click", handleNext);
  prevBtn.addEventListener("click", handlePrev);
};

if (viewMoreBtn) {
  init();
}
