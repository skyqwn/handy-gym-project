"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fileInput = document.querySelector("input[type=file]");
var dataTransfer = new DataTransfer();
var preview = document.getElementById("preview");
var fakeFileBtn = document.getElementById("fakeFileBtn");

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

  var compressedUrl = window.URL.createObjectURL(imgSrc);
  previewImg.src = compressedUrl;

  previewContainer.classList.add("previewContainer");
  previewImg.classList.add("previewContainer__img");
  deleteBtn.classList.add("previewContainer__btn");

  previewContainer.append(deleteBtn);
  previewContainer.append(previewImg);
  preview.appendChild(previewContainer);
};

var handleImageUpload = async function handleImageUpload(event) {
  var imageFiles = event.target.files;

  var compressOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 760,
    initalQuality: 0.8,
    useWebWorker: false
  };

  var compressFile = async function compressFile(file) {
    try {
      if (dataTransfer.files.length >= 6) {
        return;
      }
      var randomId = Math.random().toString(16).slice(2);

      var compressedBlob = await imageCompression(file, compressOptions);
      compressedBlob.name = file.name + "_compressed";

      var compressedFile = new File([compressedBlob], compressedBlob.name, {
        type: "image/*"
      });

      compressedFile.id = randomId;

      paintPreview(compressedFile, randomId);

      dataTransfer.items.add(compressedFile);
      saveFiles();
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

fileInput.addEventListener("change", handleImageUpload);

fakeFileBtn.addEventListener("click", function () {
  return fileInput.click();
});