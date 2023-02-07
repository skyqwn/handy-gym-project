"use strict";

var form = document.querySelector("form");
var validErrorMessage = document.getElementById("validErrorMessage");

var createErrorMessage = function createErrorMessage(message) {
  alert(message || "필수항목을 입력하세요");
};

var validEmail = function validEmail(input) {
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (input.value.match(validRegex)) {
    return true;
  } else {
    return false;
  }
};

var paintBtnError = function paintBtnError(ele) {
  ele.style.backgroundColor = "#ff5e57";
};
var initBtn = function initBtn(ele) {
  ele.style.backgroundColor = "#00b894";
};

var paintBorderError = function paintBorderError(ele) {
  ele.style.border = "1px solid #ff5e57";
};

var initBorder = function initBorder(ele) {
  ele.style.border = "1px solid #bdc3c7";
};

var formValid = function formValid() {
  var submitBtn = form.querySelector("#jsSubmit");
  var inputs = form.querySelectorAll("input");
  var textarea = form.querySelector("textarea");
  var select = form.querySelector("select");

  var handleSubmit = function handleSubmit() {
    var ok = true;
    var yearRoundChecked = false;
    var onedayChecked = false;
    var errorMessage = "";
    var validRequired = function validRequired(ele) {
      var exceptionName = ["address", "yearRound", "oneday", "email", "onedayPay", "onedayCheckbox"];
      var name = ele.name;
      var value = ele.value;
      var isException = exceptionName.includes(name);
      var isFileInput = Boolean(ele.type === "file");
      if (isException || isFileInput) {
        if (name === "address") {
          var map = document.getElementById("kakaoMap");
          var searchAddressBtn = document.getElementById("searchAddressBtn");
          initBorder(map);
          initBtn(searchAddressBtn);
          if (!value) {
            paintBorderError(map);
            paintBtnError(searchAddressBtn);
            errorMessage = "주소를 입력해주세요";
            ok = false;
          }
        }
        if (name === "gymPhotos") {
          var files = ele.files;
          var btn = document.getElementById("fakeFileBtn");
          initBtn(btn);
          if (files.length < 4) {
            paintBtnError(btn);
            errorMessage = "사진을 4장이상 넣어주세요";
            ok = false;
          }
        }
        if (name === "galleryPhotos") {
          var _btn = document.getElementById("fakeFileBtn");
          var _files = ele.files;
          initBorder(_btn);
          if (_files.length === 0) {
            ok = false;
            paintBorderError(_btn);
            errorMessage = "사진을 1장이상 넣어주세요";
          }
        }
        if (name === "yearRound") {
          var labels = document.querySelectorAll(".yearRoundLabel");
          if (ele.checked) {
            ok = true;
            yearRoundChecked = true;
            for (var i = 0; i < labels.length; i++) {
              initBorder(labels[i]);
            }
          }
          if (!yearRoundChecked) {
            ok = false;
            for (var _i = 0; _i < labels.length; _i++) {
              paintBorderError(labels[_i]);
            }
          }
        }
        if (name === "oneday") {
          var _labels = document.querySelectorAll(".onedayLabel");
          if (ele.checked) {
            ok = true;
            onedayChecked = true;
            for (var _i2 = 0; _i2 < _labels.length; _i2++) {
              initBorder(_labels[_i2]);
            }
          }
          if (!onedayChecked) {
            ok = false;
            for (var _i3 = 0; _i3 < _labels.length; _i3++) {
              paintBorderError(_labels[_i3]);
            }
          }
        }
        if (name === "onedayPay") {
          var yesOneday = document.getElementById("oneday1");
          initBorder(ele);
          if (yesOneday.checked) {
            if (!ele.value) {
              ok = false;
              paintBorderError(ele);
            }
          }
        }
        if (name === "email") {
          var emailBoolean = validEmail(ele);
          initBorder(ele);
          if (!emailBoolean || !ele.value) {
            paintBorderError(ele);
            errorMessage = "이메일 형식이 아닙니다";
            ele.focus();
          }
        }
      } else {
        initBorder(ele);
        if (!value) {
          paintBorderError(ele);
          errorMessage = "필수항목을 입력하세요";
          ok = false;
        }
      }
    };

    for (var i = 0; i < inputs.length; i++) {
      validRequired(inputs[i]);
    }

    if (textarea) {
      validRequired(textarea);
    }

    if (select) {
      validRequired(select);
    }

    if (ok) {
      form.submit();
    } else {
      createErrorMessage(errorMessage);
    }
  };

  submitBtn.addEventListener("click", handleSubmit);
};

formValid();