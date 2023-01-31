"use strict";

var form = document.querySelector("form");

var validErrorMessage = document.getElementById("validErrorMessage");

var createErrorMessage = function createErrorMessage(message) {
  validErrorMessage.innerHTML = "";
  validErrorMessage.innerText = message || "필수항목을 입력하세요";
  validErrorMessage.classList.add("errorValid");
};

var validEmail = function validEmail(input) {
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (input.value.match(validRegex)) {
    return true;
  } else {
    return false;
  }
};

var formValid = function formValid(ele) {
  var submitBtn = ele.querySelector("#jsSubmit");

  var inputs = ele.querySelectorAll("input");
  var textarea = ele.querySelector("textarea");
  var select = ele.querySelector("select");

  // GYM 전용 선택자

  var address = ele.querySelector("input[name=address]");
  var photosInput = ele.querySelector("input[name=photos]");
  var yearRoundRadio = ele.querySelectorAll("input[name=yearRound]");
  var onedayRadio = ele.querySelectorAll("input[name=oneday]");

  var emailInput = ele.querySelector("input[type=email]");

  var handleSubmit = function handleSubmit() {
    var ok = true;

    var validRequired = function validRequired(ele) {
      var exceptionName = ["address", "photos", "yearRound", "oneday", "email"];
      var name = ele.name;
      var value = ele.value;
      ele.classList.remove("valid");
      if (!value) {
        ele.classList.add("valid");
        createErrorMessage();
        ok = false;
      }
    };

    if (emailInput && emailInput.value) {
      var emailBoolean = validEmail(emailInput);
      if (!emailBoolean) {
        createErrorMessage("이메일 형식이 아닙니다");
        emailInput.classList.remove("valid");
        emailInput.classList.add("valid");
        emailInput.focus();
        return;
      }
    }

    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].name !== "onedayPay" || inputs[i].name !== "address" || inputs[i].name !== "location" || inputs[i].type !== "file" || inputs[i].type !== "radio" || inputs[i].type !== "checkbox") {
        validRequired(inputs[i]);
      }
    }

    if (textarea) {
      validRequired(textarea);
    }

    if (select) {
      validRequired(select);
    }

    if (address) {
      var value = address.value;
      var map = document.getElementById("kakaoMap");
      var searchAddressBtn = document.getElementById("searchAddressBtn");
      map.classList.remove("valid");
      searchAddressBtn.style.backgroundColor = "#00b894";

      if (!value) {
        map.classList.add("valid");
        searchAddressBtn.style.backgroundColor = "#ff5e57";
        createErrorMessage("주소를 검색하세요");
        ok = false;
      }
    }

    if (photosInput) {
      var files = photosInput.files;
      var btn = document.getElementById("fakeFileBtn");
      console.log(photosInput);
      console.log(btn);
      btn.style.backgroundColor = "#00b894";

      if (files.length < 4) {
        btn.style.backgroundColor = "#ff5e57";
        createErrorMessage("사진을 4장 이상 올려주세요");
        ok = false;
      }
    }

    // if (yearRoundRadio.length > 0) {
    //   let radioOk = false;
    //   for (let i = 0; i < yearRoundRadio.length; i++) {
    //     if (yearRoundRadio[i].checked) {
    //       radioOk = true;
    //     }
    //   }
    //   const labels = document.querySelectorAll(".yearRoundLabel");
    //   if (!radioOk) {
    //     for (let i = 0; i < labels.length; i++) {
    //       labels[i].style.border = "2px solid #ff5e57";
    //     }
    //   } else {
    //     for (let i = 0; i < labels.length; i++) {
    //       labels[i].style.border = "1px solid #00b894";
    //     }
    //   }
    // }

    // if (onedayRadio.length > 0) {
    //   let radioOk = false;
    //   for (let i = 0; i < onedayRadio.length; i++) {
    //     if (onedayRadio[i].checked) {
    //       radioOk = true;
    //     }
    //   }
    //   const labels = document.querySelectorAll(".onedayLabel");
    //   if (!radioOk) {
    //     for (let i = 0; i < labels.length; i++) {
    //       labels[i].style.border = "2px solid #ff5e57";
    //     }
    //   } else {
    //     for (let i = 0; i < labels.length; i++) {
    //       labels[i].style.border = "1px solid #00b894";
    //     }
    //   }
    // }

    if (ok) {
      ele.submit();
    }
  };

  submitBtn.addEventListener("click", handleSubmit);
};

formValid(form);