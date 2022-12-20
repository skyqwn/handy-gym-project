const viewMoreBtn = document.getElementById("viewMore");
const modalContainer = document.querySelector(".modalContainer");
const modal = document.querySelector(".modal");
const xBtn = document.querySelector("#xBtn");
const body = document.querySelector("body");

const slideContainer = document.querySelector(".slideContainer");
const imgs = document.querySelectorAll(".gymImg");
const nextBtn = document.getElementById("nextSlide");
const prevBtn = document.getElementById("prevSlide");
const slideNumber = document.getElementById("slideNumber");

const modalOpen = () => {
  modalContainer.style.transform = "translateY(0)";
  modalContainer.style.opacity = "1";
  modal.style.top = `${window.scrollY}px`;
  body.style.overflowY = "hidden";
};

const modalClose = () => {
  modalContainer.style.transform = "translateY(-100%)";
  modalContainer.style.opacity = "0";
  body.style.overflowY = "scroll";
};

let SLIDE_INDEX = 0;

const paintImgsSlide = (index) => {
  for (let i = 0; i < imgs.length; i++) {
    if (index === i) {
      imgs[i].style.opacity = "1";
      slideNumber.innerText = `${i + 1}  / ${imgs.length}`;
    } else {
      imgs[i].style.opacity = "0";
    }
  }
  // const percent = -100 * index;
  // slideContainer.style.transform = `translateX(${percent}%)`;
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

const init = () => {
  paintImgsSlide(SLIDE_INDEX);
  viewMoreBtn.addEventListener("click", modalOpen);
  xBtn.addEventListener("click", modalClose);
  nextBtn.addEventListener("click", handleNext);
  prevBtn.addEventListener("click", handlePrev);
};

init();
