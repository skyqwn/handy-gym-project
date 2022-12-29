"use strict";

var modalBtn = document.getElementById("modalBtn");
var modalContainer = document.querySelector(".modalContainer");

var openModal = function openModal() {
  modalContainer.style.transform = "translateY(0)";
};

var closeModal = function closeModal(e) {
  if (e.target === modalContainer) {
    modalContainer.style.transform = "translateY(-100%)";
  }
};

var init = function init() {
  modalBtn.addEventListener("click", openModal);
  modalContainer.addEventListener("click", closeModal);
};

if (modalBtn) {
  init();
}