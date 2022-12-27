"use strict";

var modalBtn = document.getElementById("modalBtn");
var modalContainer = document.querySelector(".modalContainer");

var openModal = function openModal() {
  modalContainer.style.transform = "translateY(0)";
};

var closeModal = function closeModal(e) {
  var isContainer = e.target.classList.contains("modalContainer");
  if (isContainer) {
    modalContainer.style.transform = "translateY(-100%)";
  }
  return;
};

var init = function init() {
  modalBtn.addEventListener("click", openModal);
  modalContainer.addEventListener("click", closeModal);
};

if (modalBtn) {
  init();
}