const modalBtn = document.getElementById("modalBtn");
const modalContainer = document.querySelector(".modalContainer");

const openModal = () => {
  modalContainer.style.transform = "translateY(0)";
};

const closeModal = (e) => {
  const isContainer = e.target.classList.contains("modalContainer");
  if (isContainer) {
    modalContainer.style.transform = "translateY(-100%)";
  }
  return;
};

const init = () => {
  modalBtn.addEventListener("click", openModal);
  modalContainer.addEventListener("click", closeModal);
};

if (modalBtn) {
  init();
}
