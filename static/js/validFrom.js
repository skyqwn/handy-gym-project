"use strict";

var signinForm = document.getElementById("signinForm");
var signupForm = document.getElementById("signupForm");
var jsPostUploadForm = document.getElementById("jsPostUploadForm");
var validErrorMessage = document.getElementById("validErrorMessage");

var form = document.querySelector("form");

var createErrorMessage = function createErrorMessage(message) {
  validErrorMessage.innerHTML = "";
  validErrorMessage.innerHTML = message || "필수항목을 입력하세요";
  validErrorMessage.classList.add("validMessage");
};

var signinValid = function signinValid() {
  var emailInput = signinForm.querySelector("input[type=email]");
  var passwordInput = signinForm.querySelector("input[type=password]");
  var signinSubmit = signinForm.querySelector("#jsSubmit");

  signinSubmit.addEventListener("click", function (e) {
    if (!emailInput.value) {
      emailInput.classList.add("valid");
      createErrorMessage();
    }
    if (!passwordInput.value) {
      passwordInput.classList.add("valid");
      createErrorMessage();
      return;
    }
    signinForm.submit();
  });
};

var signupValid = function signupValid() {
  var emailInput = signinForm.querySelector("input[type=email]");
  var passwordInput = signinForm.querySelector("input[type=password]");
  var signinSubmit = signinForm.querySelector("#jsSubmit");

  signinSubmit.addEventListener("click", function (e) {
    if (!emailInput.value) {
      emailInput.classList.add("valid");
      createErrorMessage();
    }
    if (!passwordInput.value) {
      passwordInput.classList.add("valid");
      createErrorMessage();
      return;
    }
    signinForm.submit();
  });
};

var validEmail = function validEmail(ele) {
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (ele.value.match(validRegex)) {
    return true;
  } else {
    return false;
  }
};

var formValid = function formValid(ele) {
  var submitBtn = ele.querySelector("#jsSubmit");

  submitBtn.addEventListener("click", function () {
    var ok = true;
    var inputs = ele.querySelectorAll("input");
    var textarea = ele.querySelector("textarea");
    var select = ele.querySelector("select");

    var emailInput = document.querySelector("ele[type=email]");

    if (emailInput && emailInput.value) {
      var emailBoolean = validEmail(emailInput);
      if (!emailBoolean) {
        emailInput.classList.remove("valid");
        emailInput.classList.add("valid");
        createErrorMessage("이메일 형식이 아닙니다");
        emailInput.focus();
        return;
      }
    }

    var validRequired = function validRequired(ele) {
      var value = ele.value;
      ele.classList.remove("valid");

      if (!value) {
        ele.classList.add("valid");
        createErrorMessage();
        ok = false;
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
      ele.submit();
    }
  });
};

// if (signinForm) {
//   formValid(signinForm);
// }

// if (signupForm) {
//   formValid(signupForm);
// }

// if (jsPostUploadForm) {
//   formValid(jsPostUploadForm);
// }

formValid(form);