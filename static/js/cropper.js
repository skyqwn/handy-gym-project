"use strict";

var body = document.querySelector("body");
var modalContainer = document.querySelector(".modalContainer");
var modal = document.querySelector(".modal");
var modalItem = document.querySelector(".modal__item");

var fileInput = document.querySelector("input[type=file]");
var galleryPreview = document.getElementById("galleryPreview");

var cropper = void 0;

var dataTransfer = new DataTransfer();

var cropSave = function cropSave(e, id) {
  e.preventDefault();
  cropper.getCroppedCanvas({
    minWidth: 256,
    minHeight: 256,
    maxWidth: 4096,
    maxHeight: 4096
  }).toBlob(function (blob) {
    var randomId = Math.random().toString(16).slice(2);
    var img = document.getElementById(id);
    console.log(img);
    img.src = URL.createObjectURL(blob);
    img.id = randomId;

    //
    var convertFile = new File([blob], blob.name || "cropedImg", {
      type: "images/*"
    });
    var updatedFiles = Array.from(dataTransfer.files).map(function (dataFile) {
      if (dataFile.id === id) {
        return convertFile;
      }

      return dataFile;
    });

    dataTransfer.items.clear();
    for (var i = 0; i < updatedFiles.length; i++) {
      dataTransfer.items.add(updatedFiles[i]);
    }
    fileInput.files = dataTransfer.files;
    closeCrop();
  });
};

var openCrop = function openCrop(imgSrc, id) {
  modalContainer.style.transform = "translateY(0)";
  modal.style.top = window.scrollY + "px";
  body.style.overflowY = "hidden";

  var img = document.createElement("img");
  img.src = imgSrc;
  cropper = new Cropper(img);
  var cropSaveBtn = document.createElement("div");
  cropSaveBtn.innerText = "수정";
  cropSaveBtn.addEventListener("click", function (e) {
    return cropSave(e, id);
  });
  modalItem.append(img);
  modalItem.append(cropSaveBtn);
};

var closeCrop = function closeCrop(e) {
  modalContainer.style.transform = "translateY(-100%)";
  body.style.overflowY = "scroll";
  if (e.target === modalContainer) {}
};

var handleChange = function handleChange(e) {
  var imageFiles = e.target.files;

  var _loop = function _loop(i) {
    var randomId = Math.random().toString(16).slice(2);

    var file = imageFiles[i];
    file.id = randomId;

    dataTransfer.items.add(file);
    console.log(dataTransfer.files);

    var blob = window.URL.createObjectURL(file);
    var previewContainer = document.createElement("div");

    var previewImg = document.createElement("img");
    previewImg.id = randomId;
    previewImg.src = blob;

    var editBtn = document.createElement("div");
    editBtn.innerText = "수정";
    editBtn.addEventListener("click", function (e) {
      return openCrop(blob, randomId);
    });
    previewContainer.append(previewImg);
    previewContainer.append(editBtn);
    galleryPreview.append(previewContainer);
  };

  for (var i = 0; i < imageFiles.length; i++) {
    _loop(i);
  }
};

fileInput.addEventListener("change", handleChange);
// modalContainer.addEventListener("click", closeCrop);