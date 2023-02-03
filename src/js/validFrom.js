const form = document.querySelector("form");
const validErrorMessage = document.getElementById("validErrorMessage");

const createErrorMessage = (message) => {
  alert(message || "필수항목을 입력하세요");
};

const validEmail = (input) => {
  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (input.value.match(validRegex)) {
    return true;
  } else {
    return false;
  }
};

const paintBtnError = (ele) => {
  ele.style.backgroundColor = "#ff5e57";
};
const initBtn = (ele) => {
  ele.style.backgroundColor = "#00b894";
};

const paintBorderError = (ele) => {
  ele.style.border = "1px solid #ff5e57";
};

const initBorder = (ele) => {
  ele.style.border = "1px solid #bdc3c7";
};

const formValid = () => {
  const submitBtn = form.querySelector("#jsSubmit");
  const inputs = form.querySelectorAll("input");
  const textarea = form.querySelector("textarea");
  const select = form.querySelector("select");

  const handleSubmit = () => {
    let ok = true;
    let yearRoundChecked = false;
    let onedayChecked = false;
    let errorMessage = "";
    const validRequired = (ele) => {
      const exceptionName = [
        "address",
        "yearRound",
        "oneday",
        "email",
        "onedayPay",
        "onedayCheckbox",
      ];
      const name = ele.name;
      const value = ele.value;
      const isException = exceptionName.includes(name);
      const isFileInput = Boolean(ele.type === "file");
      if (isException || isFileInput) {
        if (name === "address") {
          const map = document.getElementById("kakaoMap");
          const searchAddressBtn = document.getElementById("searchAddressBtn");
          initBorder(map);
          initBtn(searchAddressBtn);
          if (!value) {
            paintBorderError(map);
            paintBtnError(searchAddressBtn);
            errorMessage = "주소를 입력해주세요";
            ok = false;
            console.log("주소에러");
          }
        }
        if (name === "gymPhotos") {
          const files = ele.files;
          const btn = document.getElementById("fakeFileBtn");
          initBtn(btn);
          if (files.length < 4) {
            paintBtnError(btn);
            errorMessage = "사진을 4장이상 넣어주세요";
            ok = false;
            console.log("사진에러");
          }
        }
        if (name === "galleryPhotos") {
          const btn = document.getElementById("fakeFileBtn");
          const files = ele.files;
          initBorder(btn);
          if (files.length === 0) {
            ok = false;
            paintBorderError(btn);
            errorMessage = "사진을 1장이상 넣어주세요";
          }
        }
        if (name === "yearRound") {
          const labels = document.querySelectorAll(".yearRoundLabel");
          if (ele.checked) {
            ok = true;
            yearRoundChecked = true;
            for (let i = 0; i < labels.length; i++) {
              initBorder(labels[i]);
            }
          }
          if (!yearRoundChecked) {
            ok = false;
            for (let i = 0; i < labels.length; i++) {
              paintBorderError(labels[i]);
            }
            console.log("연중무휴에러");
          }
        }
        if (name === "oneday") {
          const labels = document.querySelectorAll(".onedayLabel");
          if (ele.checked) {
            ok = true;
            onedayChecked = true;
            for (let i = 0; i < labels.length; i++) {
              initBorder(labels[i]);
            }
          }
          if (!onedayChecked) {
            ok = false;
            for (let i = 0; i < labels.length; i++) {
              paintBorderError(labels[i]);
            }
            console.log("일일권에러");
          }
        }
        if (name === "onedayPay") {
          const yesOneday = document.getElementById("oneday1");
          initBorder(ele);
          if (yesOneday.checked) {
            if (!ele.value) {
              ok = false;
              paintBorderError(ele);
            }
          }
        }
        if (name === "email") {
          const emailBoolean = validEmail(ele);
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
          console.log("필수항목에러");
        }
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
      form.submit();
    } else {
      createErrorMessage(errorMessage);
    }
  };

  submitBtn.addEventListener("click", handleSubmit);
};

formValid();
