const onedayRadios = document.querySelectorAll("input[name=oneday]");
const jsOnedayPay = document.getElementById("jsOnedayPay");
const onedayPayInput = document.querySelector("input[name=onedayPay]");
const onedayPayCheckBox = document.getElementById("onedayPayCheckBox");

const handleRadio = (e) => {
  const {
    target: { checked, value },
  } = e;
  if (checked) {
    if (value === "가능") {
      jsOnedayPay.style.display = "flex";
    }
    if (value === "불가능" || value === "모름") {
      jsOnedayPay.style.display = "none";
    }
  }
};

const handleCheckBox = (e) => {
  if (e.target.checked) {
    // onedayPayInput.disabled = true;
    return (onedayPayInput.value = "모름");
  }
  onedayPayInput.value = "";
  // onedayPayInput.disabled = false;
};

const onlyNumber = (e) => {
  if (onedayPayCheckBox.checked) {
    e.target.value = "모름";
    return;
  }
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};

const init = () => {
  jsOnedayPay.style.display = "none";
  for (let i = 0; i < onedayRadios.length; i++) {
    onedayRadios[i].addEventListener("change", handleRadio);
  }
  onedayPayInput.addEventListener("input", onlyNumber);
  onedayPayCheckBox.addEventListener("change", handleCheckBox);
};

init();
