const modalBtn = document.getElementById("modalBtn");
const modalContainer = document.querySelector(".modalContainer");

const openModal = () => {
  modalContainer.style.transform = "translateY(0)";
};

const closeModal = (e) => {
  if (e.target === modalContainer) {
    modalContainer.style.transform = "translateY(-100%)";
  }
};

const init = () => {
  modalBtn.addEventListener("click", openModal);
  modalContainer.addEventListener("click", closeModal);
};

if (modalBtn) {
  init();
}
