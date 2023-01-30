const signinForm = document.getElementById("signinForm");
const signupForm = document.getElementById("signupForm");
const jsPostUploadForm = document.getElementById("jsPostUploadForm");
const validErrorMessage = document.getElementById("validErrorMessage");

const form = document.querySelector("form");

const createErrorMessage = (message) => {
  validErrorMessage.innerHTML = "";
  validErrorMessage.innerHTML = message || "필수항목을 입력하세요";
  validErrorMessage.classList.add("validMessage");
};

const signinValid = () => {
  const emailInput = signinForm.querySelector("input[type=email]");
  const passwordInput = signinForm.querySelector("input[type=password]");
  const signinSubmit = signinForm.querySelector("#jsSubmit");

  signinSubmit.addEventListener("click", (e) => {
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

const signupValid = () => {
  const emailInput = signinForm.querySelector("input[type=email]");
  const passwordInput = signinForm.querySelector("input[type=password]");
  const signinSubmit = signinForm.querySelector("#jsSubmit");

  signinSubmit.addEventListener("click", (e) => {
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

const validEmail = (ele) => {
  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (ele.value.match(validRegex)) {
    return true;
  } else {
    return false;
  }
};

const formValid = (ele) => {
  const submitBtn = ele.querySelector("#jsSubmit");

  submitBtn.addEventListener("click", () => {
    let ok = true;
    const inputs = ele.querySelectorAll("input");
    const textarea = ele.querySelector("textarea");
    const select = ele.querySelector("select");

    const emailInput = document.querySelector("ele[type=email]");

    if (emailInput && emailInput.value) {
      const emailBoolean = validEmail(emailInput);
      if (!emailBoolean) {
        emailInput.classList.remove("valid");
        emailInput.classList.add("valid");
        createErrorMessage("이메일 형식이 아닙니다");
        emailInput.focus();
        return;
      }
    }

    const validRequired = (ele) => {
      const value = ele.value;
      ele.classList.remove("valid");

      if (!value) {
        ele.classList.add("valid");
        createErrorMessage();
        ok = false;
      }
    };

    for (let i = 0; i < inputs.length; i++) {
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
