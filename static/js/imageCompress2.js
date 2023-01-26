"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fileInput = document.querySelector("input[name=photos]");
var preview = document.getElementById("preview");
var fakeFileBtn = document.getElementById("fakeFileBtn");
var originalPreviews = document.querySelectorAll(".originalPreview");

var MAX_FILE = 6;

var dataTransfer = new DataTransfer();

var startLoading = function startLoading(ele) {
  ele.innerHTML = "";
  if (ele.classList.contains("fa-pen")) {
    ele.classList.remove("fa-pen");
    ele.classList.add("fa-spinner");
    ele.classList.add("fa-spin-pulse");
    return;
  }
  ele.innerHTML = "<i class=\"fa-solid fa-spinner fa-spin-pulse\"></i>";
  ele.disable = true;
};

var endLoading = function endLoading(ele) {
  ele.innerHTML = "";
  ele.innerHTML = "<i class=\"fa-solid fa-plus\"></i>";
  ele.disable = false;
};

var handleChange = function handleChange(event) {
  var imgFiles = event.target.files;

  startLoading(fakeFileBtn);
};

var convertBlobToFile = function convertBlobToFile(blob) {
  var convertFile = new File([blob], blob.name || "preview", {
    type: "images/*"
  });
  return convertFile;
};

var generateBtns = function generateBtns(id) {
  var deleteBtn = document.createElement("div");
  deleteBtn.innerHTML = "<i class=\"fa-solid fa-xmark\"></i>";
  deleteBtn.addEventListener("click", function (e) {
    deletePreview(id);
  });
  var deletePreview = function deletePreview(id) {
    var container = document.getElementById(id);
    container.remove();

    var findIndexById = [].concat(_toConsumableArray(dataTransfer.files)).findIndex(function (file) {
      return file.id === id;
    });

    dataTransfer.items.remove(findIndexById);

    fileInput.files = dataTransfer.files;
  };

  var updateBtn = document.createElement("div");
  updateBtn.innerHTML = "<i class=\"fa-solid fa-pen\"></i>";
  updateBtn.addEventListener("click", function (e) {
    updatePreview(id, e.target);
  });
  var updatePreview = function updatePreview(id, btn) {
    var input = document.createElement("input");
    input.type = "file";
    input.click();
    input.addEventListener("change", function (e) {
      return updateChange(e, id, btn);
    });
  };
  return { deleteBtn: deleteBtn, updateBtn: updateBtn };
};

var updateChange = async function updateChange(e, targetId, updateBtn) {
  try {
    startLoading(updateBtn);

    var newId = generateRandomId();
    var file = await compressFile(e.target.files[0]);
    file.id = newId;

    handleUpdateFile(file, targetId);
  } catch (error) {
    console.log(error);
    alert("파일 수정 도중 오류발생");
    return;
  }
  return;
};

var paintPreview = function paintPreview(imgSrc, id) {
  var previewContainer = document.createElement("div");
  previewContainer.id = id;

  var btnContainer = document.createElement("div");

  var previewImg = document.createElement("img");

  var url = URL.createObjectURL(imgSrc);

  previewImg.onload = function () {
    URL.revokeObjectURL(url);
  };

  previewImg.src = url;

  previewContainer.classList.add("previewContainer");
  preview.classList.add("previewContainer__img");
  btnContainer.classList.add("previewContaienr__btn");

  var _generateBtns = generateBtns(id),
      deleteBtn = _generateBtns.deleteBtn,
      updateBtn = _generateBtns.updateBtn;

  btnContainer.appendChild(updateBtn);
  btnContainer.appendChild(deleteBtn);

  previewContainer.appendChild(previewImg);
  previewContainer.appendChild(btnContainer);

  preview.append(previewContainer);
};

var init = function init() {
  fileInput.addEventListener("change", handleChange);
  fakeFileBtn.addEventListener("click", function (e) {
    e.preventDefault();
    fileInput.click();
  });
  if (originalPreviews.length > 0) {
    var handleLoad = async function handleLoad() {
      var paintPhoto = async function paintPhoto(imageEle) {
        var canvas = document.createElement("canvas");
        canvas.height = imageEle.naturalHeight;
        canvas.width = imageEle.naturalWidth;
        canvas.getContext("2d").drawImage(imageEle, 0, 0);
        try {
          var blob = await new Promise(function (resolve) {
            return canvas.toBlob(function (blob) {
              return resolve(blob);
            });
          });
          var file = convertBlobToFile(blob);
          var id = generateRandomId();
          file.id = id;
          paintPreview(file, id);
        } catch (error) {
          console.log(error);
          alert("미리보기 생성 중 오류발생");
        }
      };
    };
  }
};