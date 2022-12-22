"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fileInput = document.querySelector("input[type=file]");
var dataTransfer = new DataTransfer();
var preview = document.getElementById("preview");
var fakeFileBtn = document.getElementById("fakeFileBtn");
var originalPreviews = document.querySelectorAll(".originalPreview");

var deletePreview = function deletePreview(id) {
  var container = document.getElementById(id);
  container.remove();
  var findIndexById = [].concat(_toConsumableArray(dataTransfer.files)).findIndex(function (file) {
    return file.id === id;
  });
  dataTransfer.items.remove(findIndexById);
  fileInput.files = dataTransfer.files;
};

var updatePreview = function updatePreview(id) {
  var input = document.createElement("input");
  input.type = "file";
  input.click();
  input.addEventListener("change", function (e) {
    return handleChange(e, true, id);
  });
};

var paintPreview = function paintPreview(imgSrc, id) {
  var previewContainer = document.createElement("div");
  previewContainer.id = id;
  var previewImg = document.createElement("img");

  var btnContainer = document.createElement("div");

  var deleteBtn = document.createElement("div");
  deleteBtn.innerHTML = "<i class=\"fa-solid fa-xmark fa-bg-white\"></i>";
  deleteBtn.addEventListener("click", function () {
    deletePreview(id);
  });

  var updateBtn = document.createElement("div");
  updateBtn.innerHTML = "<i class=\"fa-solid fa-pen fa-bg-white\"></i>";
  updateBtn.addEventListener("click", function (e) {
    updatePreview(id);
  });

  var compressedUrl = window.URL.createObjectURL(imgSrc);
  previewImg.src = compressedUrl;

  previewContainer.classList.add("previewContainer");
  previewImg.classList.add("previewContainer__img");
  btnContainer.classList.add("previewContainer__btn");

  btnContainer.appendChild(updateBtn);
  btnContainer.appendChild(deleteBtn);
  previewContainer.append(btnContainer);
  previewContainer.append(previewImg);
  preview.appendChild(previewContainer);
};

var handleChange = async function handleChange(event, isUpdate, id) {
  var imageFiles = event.target.files;

  var compressOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 960,
    initalQuality: 0.8,
    useWebWorker: false
  };

  var compressFile = async function compressFile(file) {
    try {
      if (dataTransfer.files.length >= 6) {
        return;
      }

      var compressedBlob = await imageCompression(file, compressOptions);
      compressedBlob.name = file.name + "_compressed";
      paintPreviewAndHandleDatatransfer(compressedBlob, isUpdate, id);
    } catch (error) {
      console.log(error);
      return alert("오류");
    }
  };

  for (var i = 0; i < imageFiles.length; i++) {
    await compressFile(imageFiles[i]);
  }

  if (dataTransfer.files.length >= 6) {
    return alert("사진은 6장까지 업로드 가능합니다.");
  }
};

var handleOriginalPreviews = async function handleOriginalPreviews() {
  var getBlob = async function getBlob(imgEle) {
    var canvas = document.createElement("canvas");
    canvas.width = imgEle.naturalWidth;
    canvas.height = imgEle.naturalHeight;

    var context = canvas.getContext("2d");

    context.drawImage(imgEle, 0, 0);

    var blob = await new Promise(function (resolve) {
      return canvas.toBlob(function (blob) {
        return resolve(blob);
      });
    });
    paintPreviewAndHandleDatatransfer(blob);
  };

  for (var i = 0; i < originalPreviews.length; i++) {
    await getBlob(originalPreviews[i]);
  }
};

var paintPreviewAndHandleDatatransfer = function paintPreviewAndHandleDatatransfer(blob) {
  var isUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

  var randomId = Math.random().toString(16).slice(2);

  var file = new File([blob], blob.name, {
    type: "image/*"
  }); //새로 압축된 파일

  file.id = randomId;
  if (isUpdate) {
    //다시볼것
    var updatedFiles = Array.from(dataTransfer.files).map(function (currentFile) {
      if (currentFile.id === id) {
        var container = document.getElementById(id);
        container.id = randomId;
        var img = container.childNodes[1];
        var btnContainer = container.childNodes[0];

        btnContainer.innerHTML = "";

        var deleteBtn = document.createElement("div");
        deleteBtn.innerHTML = "<i class=\"fa-solid fa-xmark fa-bg-white\"></i>";
        deleteBtn.addEventListener("click", function () {
          deletePreview(randomId);
        });

        var updateBtn = document.createElement("div");
        updateBtn.innerHTML = "<i class=\"fa-solid fa-pen fa-bg-white\"></i>";
        updateBtn.addEventListener("click", function (e) {
          updatePreview(randomId);
        });

        btnContainer.appendChild(updateBtn);
        btnContainer.appendChild(deleteBtn);
        img.src = URL.createObjectURL(file);
        return file;
      }

      return currentFile;
    });

    dataTransfer.items.clear();
    for (var i = 0; i < updatedFiles.length; i++) {
      dataTransfer.items.add(updatedFiles[i]);
    }
    fileInput.files = dataTransfer.files;
  } else {
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;

    paintPreview(file, randomId);
  }
};

var init = function init() {
  if (originalPreviews.length > 0) {
    window.addEventListener("load", handleOriginalPreviews);
  }

  fileInput.addEventListener("change", handleChange);

  fakeFileBtn.addEventListener("click", function () {
    return fileInput.click();
  });
};

init();