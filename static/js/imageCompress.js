"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fileInput = document.querySelector("input[type=file]");
var dataTransfer = new DataTransfer();
var preview = document.getElementById("preview");
var fakeFileBtn = document.getElementById("fakeFileBtn");
var originalPreviews = document.querySelectorAll(".originalPreview");

var generateRandomId = function generateRandomId() {
  return Math.random().toString(16).slice(2);
};

var updateChange = async function updateChange(e, targetId) {
  try {
    var file = await compressedFile(e.target.files[0]);
    var newId = generateRandomId();
    file.id = newId;
    handleUpdateFile(file, targetId);
  } catch (error) {
    console.log(error);
  }
};

var generateBtns2 = function generateBtns2(id) {
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
      return updateChange(e, id);
    });
  };
  var deleteBtn = document.createElement("div");
  deleteBtn.innerHTML = "<i class=\"fa-solid fa-xmark fa-bg-white\"></i>";
  deleteBtn.addEventListener("click", function (e) {
    deletePreview(id);
  });

  var updateBtn = document.createElement("div");
  updateBtn.innerHTML = "<i class=\"fa-solid fa-pen fa-bg-white\"></i>";
  updateBtn.addEventListener("click", function (e) {
    updatePreview(e, id);
  });
};

var generateBtns = function generateBtns(id) {
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
      return updateChange(e, id);
    });
  };

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

  return { deleteBtn: deleteBtn, updateBtn: updateBtn };
};

var convertBlobToFile = function convertBlobToFile(blob) {
  var convertFile = new File([blob], blob.name || "previews", {
    type: "images/*"
  });
  return convertFile;
};

var compressedFile = async function compressedFile(file) {
  var compressOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 960,
    initalQuality: 0.8,
    useWebWorker: false
  };

  try {
    if (dataTransfer.files.length >= 6) {
      return;
    }

    var blob = await imageCompression(file, compressOptions);
    blob.name = file.name + "_compressed";
    var convertFile = convertBlobToFile(blob);
    return convertFile;
  } catch (error) {
    console.log(error);
    return alert("이미지 압축중 오류");
  }
};

var paintUpdatePreview = function paintUpdatePreview(file, targetId) {
  var container = document.getElementById(targetId);
  container.id = file.id;
  var img = container.childNodes[1];
  var btnContainer = container.childNodes[0];

  btnContainer.innerHTML = "";

  var _generateBtns = generateBtns(file.id),
      deleteBtn = _generateBtns.deleteBtn,
      updateBtn = _generateBtns.updateBtn;

  btnContainer.appendChild(updateBtn);
  btnContainer.appendChild(deleteBtn);
  img.src = URL.createObjectURL(file);
};

var handleUpdateFile = function handleUpdateFile(file, targetId) {
  var updatedFiles = Array.from(dataTransfer.files).map(function (dataFile) {
    if (dataFile.id === targetId) {
      paintUpdatePreview(file, targetId);
      return file;
    }

    return dataFile;
  });

  dataTransfer.items.clear();
  for (var i = 0; i < updatedFiles.length; i++) {
    dataTransfer.items.add(updatedFiles[i]);
  }
  fileInput.files = dataTransfer.files;
};

var paintPreview = function paintPreview(imgSrc, id) {
  var previewContainer = document.createElement("div");
  previewContainer.id = id;
  var previewImg = document.createElement("img");

  var btnContainer = document.createElement("div");

  var _generateBtns2 = generateBtns(id),
      deleteBtn = _generateBtns2.deleteBtn,
      updateBtn = _generateBtns2.updateBtn;

  var compressedUrl = window.URL.createObjectURL(imgSrc);
  previewImg.src = compressedUrl;

  previewContainer.classList.add("previewContainer");
  previewImg.classList.add("previewContainer__img");
  btnContainer.classList.add("previewContainer__btn");

  btnContainer.append(updateBtn);
  btnContainer.append(deleteBtn);
  previewContainer.append(btnContainer);
  previewContainer.append(previewImg);
  preview.append(previewContainer);
};

var handleAddFile = function handleAddFile(file) {
  dataTransfer.items.add(file);
  fileInput.files = dataTransfer.files;
};

var handleChange = async function handleChange(e) {
  var imageFiles = e.target.files;

  for (var i = 0; i < imageFiles.length; i++) {
    var randomId = generateRandomId();
    var file = await compressedFile(imageFiles[i]);
    file.id = randomId;

    paintPreview(file, randomId);
    handleAddFile(file);
  }

  if (dataTransfer.files.length >= 6) {
    return alert("사진은 6장까지 업로드 가능합니다. ");
  }
};

var init = function init() {
  fileInput.addEventListener("change", handleChange);

  fakeFileBtn.addEventListener("click", function () {
    fileInput.click();
  });

  if (originalPreviews.length > 0) {
    var handleLoad = async function handleLoad() {
      var paintPhoto = async function paintPhoto(imgEle) {
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
        var file = convertBlobToFile(blob);
        var randomId = generateRandomId();
        file.id = randomId;
        paintPreview(file, randomId);
        handleAddFile(file);
      };
      for (var i = 0; originalPreviews.length > i; i++) {
        await paintPhoto(originalPreviews[i]);
      }
    };
    window.addEventListener("load", handleLoad);
  }
};

init();