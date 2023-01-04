"use strict";

var body = document.querySelector("body");
var modalBtn = document.getElementById("modalBtn");
var modalContainer = document.querySelector(".modalContainer");
var modalWrapper = document.querySelector(".modalWrapper");
var openModal = function openModal() {
  modalContainer.style.transform = "translateY(0)";
  modalWrapper.style.top = window.scrollY + "px";
  body.style.overflowY = "hidden";
};

var closeModal = function closeModal(e) {
  if (e.target === modalContainer || e.target === modalWrapper) {
    modalContainer.style.transform = "translateY(-100%)";
    body.style.overflowY = "scroll";
  }
};

var init = function init() {
  modalBtn.addEventListener("click", openModal);
  modalContainer.addEventListener("click", closeModal);
};

if (modalBtn) {
  init();
}