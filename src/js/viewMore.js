const viewMoreBtn = document.getElementById("viewMore");
const viewMoreContainer = document.querySelector(".viewMoreContainer");
const viewMore = document.querySelector(".viewMore");
const body = document.querySelector("body");
const xBtn = document.getElementById("xBtn");

const imgs = document.querySelectorAll(".gymImg");
const nextBtn = document.getElementById("nextSlideBtn");
const prevBtn = document.getElementById("prevSlideBtn");

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

console.log(viewMoreBtn);

if (viewMoreBtn) {
  init();
}
