"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fileInput = document.querySelector("input[name=photos]");
var preview = document.getElementById("preview");
var fakeFileBtn = document.getElementById("fakeFileBtn");

var dataTransfer = new DataTransfer();

var MAX_FILE = 6;

// data transfer 핸들함수

var saveFiles = function saveFiles() {
  fileInput.files = dataTransfer.files;
};

var deletePreview = function deletePreview(id) {
  var container = document.getElementById(id);
  container.remove();

  var findIndexById = [].concat(_toConsumableArray(dataTransfer.files)).findIndex(function (file) {
    return file.id === id;
  });

  dataTransfer.items.remove(findIndexById);

  saveFiles();
};

var paintPreview = function paintPreview(imgSrc, id) {
  var previewContainer = document.createElement("div");
  previewContainer.id = id;

  var previewImg = document.createElement("img");
  var deleteBtn = document.createElement("div");
  deleteBtn.innerHTML = "<i class=\"fa-solid fa-circle-xmark\"></i>";
  deleteBtn.addEventListener("click", function () {
    deletePreview(id);
  });

  var compressedUrl = URL.createObjectURL(imgSrc);
  previewImg.src = compressedUrl;

  previewContainer.classList.add("previewContainer");
  previewImg.classList.add("previewContainer__img");
  deleteBtn.classList.add("previewContainer__btn");

  previewContainer.appendChild(previewImg);
  previewContainer.appendChild(deleteBtn);

  preview.append(previewContainer);
};

var handleChange = async function handleChange(event) {
  var imgFiles = event.target.files;

  var compressOption = {
    maxSizeMB: 1,
    maxWidthOrHeight: 760,
    initialQuality: 0.8,
    useWebWorker: false
  };

  var compressFile = async function compressFile(file) {
    try {
      if (dataTransfer.files.length >= MAX_FILE) {
        return;
      }

      var randomId = Math.random().toString(16).slice(2);

      var compressedBlob = await imageCompression(file, compressOption);
      compressedBlob.name = file.name + "_compressed";

      var compressedFile = new File([compressedBlob], compressedBlob.name, {
        type: "images/*"
      });

      paintPreview(compressedFile, randomId);
      compressedFile.id = randomId;

      dataTransfer.items.add(compressedFile);
      saveFiles();
    } catch (error) {
      console.log(error);
      alert("파일 올리는 도중 오류발생");
      return;
    }
  };

  for (var i = 0; i < imgFiles.length; i++) {
    await compressFile(imgFiles[i]);
  }

  if (dataTransfer.files.length >= MAX_FILE) {
    alert("\uCD5C\uB300 " + MAX_FILE + "\uC7A5\uAE4C\uC9C0 \uC5C5\uB85C\uB4DC \uAC00\uB2A5\uD569\uB2C8\uB2E4");
  }
};

fileInput.addEventListener("change", handleChange);
fakeFileBtn.addEventListener("click", function () {
  return fileInput.click();
});