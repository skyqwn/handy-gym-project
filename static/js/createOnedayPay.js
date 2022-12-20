"use strict";

var onedayRadios = document.querySelectorAll("input[name=oneday]");
var jsOnedayPay = document.getElementById("jsOnedayPay");
var onedayPayInput = document.querySelector("input[name=onedayPay]");
var onedayPayCheckBox = document.getElementById("onedayPayCheckBox");

var handleRadio = function handleRadio(e) {
  var _e$target = e.target,
      checked = _e$target.checked,
      value = _e$target.value;

  if (checked) {
    if (value === "가능") {
      jsOnedayPay.style.display = "flex";
    }
    if (value === "불가능" || value === "모름") {
      jsOnedayPay.style.display = "none";
    }
  }
};

var handleCheckBox = function handleCheckBox(e) {
  if (e.target.checked) {
    // onedayPayInput.disabled = true;
    return onedayPayInput.value = "모름";
  }
  onedayPayInput.value = "";
  // onedayPayInput.disabled = false;
};

var onlyNumber = function onlyNumber(e) {
  if (onedayPayCheckBox.checked) {
    e.target.value = "모름";
    return;
  }
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};

var init = function init() {
  jsOnedayPay.style.display = "none";
  for (var i = 0; i < onedayRadios.length; i++) {
    onedayRadios[i].addEventListener("change", handleRadio);
  }
  onedayPayInput.addEventListener("input", onlyNumber);
  onedayPayCheckBox.addEventListener("change", handleCheckBox);
};

init();