const viewMoreBtn = document.getElementById("viewMore");
const modal = document.querySelector(".modal");
const modalNext = document.querySelector(".modal__body__next");
const xBtn = document.querySelector(".xBtn");

const modalOpen = () => {
  modal.style.display = "block";
};

const modalClose = () => {
  modal.style.display = "none";
};

const init = () => {
  viewMoreBtn.addEventListener("click", modalOpen);
  xBtn.addEventListener("click", modalClose);
};

init();
