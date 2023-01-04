"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var body = document.querySelector("body");
var modalContainer = document.querySelector(".modalContainer");
var modalWrapper = document.querySelector(".modalWrapper");
var cropperContainer = document.querySelector(".cropperContainer");

var fileInput = document.querySelector("input[type=file]");
var galleryPreview = document.getElementById("galleryPreview");

var closeBtn = document.getElementById("closeBtn");

var cropper = void 0;

var dataTransfer = new DataTransfer();

var cropImgToData = function cropImgToData(blob, targetId, newId) {
  var convertFile = new File([blob], blob.name || "cropedImg", {
    type: "images/*"
  });
  convertFile.id = newId;
  var updatedFiles = Array.from(dataTransfer.files).map(function (dataFile) {
    if (dataFile.id === targetId) {
      return convertFile;
    }

    return dataFile;
  });

  dataTransfer.items.clear();
  for (var i = 0; i < updatedFiles.length; i++) {
    dataTransfer.items.add(updatedFiles[i]);
  }
  fileInput.files = dataTransfer.files;
  console.log(fileInput.files);
};

var cropSave = function cropSave(e, id) {
  e.preventDefault();
  cropper.getCroppedCanvas({
    minWidth: 256,
    minHeight: 256,
    maxWidth: 4096,
    maxHeight: 4096
  }).toBlob(function (blob) {
    var randomId = Math.random().toString(16).slice(2);

    var previewContainer = document.getElementById(id);
    previewContainer.innerHTML = "";
    previewContainer.id = randomId;

    paintPreview(previewContainer, blob, randomId);

    cropImgToData(blob, id, randomId);

    closeModal();
  });
};

var openCrop = function openCrop(imgSrc, id) {
  modalContainer.style.transform = "translateY(0)";
  modalWrapper.style.top = window.scrollY + "px";
  body.style.overflowY = "hidden";
  cropperContainer.innerHTML = "";

  var img = document.createElement("img");
  img.src = imgSrc;
  cropper = new Cropper(img, { aspectRatio: 3 / 4, zoomable: false });
  var cropSaveBtn = document.createElement("div");
  cropSaveBtn.innerText = "수정";
  cropSaveBtn.addEventListener("click", function (e) {
    return cropSave(e, id);
  });
  cropperContainer.append(img);
  cropperContainer.append(cropSaveBtn);
};

var closeModal = function closeModal() {
  modalContainer.style.transform = "translateY(-100%)";
  modalWrapper.style.top = "0";
  body.style.overflowY = "scroll";
};

var handleContainer = function handleContainer(e) {
  if (e.target === modalContainer || e.target === cropperContainer) {
    closeModal();
  }
};

var convertBlobToFile = function convertBlobToFile(blob) {
  var convertFile = new File([blob], blob.name || "previews", {
    type: "images/*"
  });
  return convertFile;
};

var compressFile = async function compressFile(file) {
  var compressOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1280,
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

var handleChange = async function handleChange(e) {
  var imageFiles = e.target.files;

  for (var i = 0; i < imageFiles.length; i++) {
    var randomId = Math.random().toString(16).slice(2);
    var file = await compressFile(imageFiles[i]);
    var previewContainer = document.createElement("div");

    previewContainer.id = randomId;
    previewContainer.classList.add("previewContainer");

    paintPreview(previewContainer, file, randomId);

    galleryPreview.append(previewContainer);

    newImgToData(file, randomId);
  }
};

var paintPreview = function paintPreview(containerEl, file, newId) {
  var blob = window.URL.createObjectURL(file);
  console.log(blob);

  var previewImg = document.createElement("img");
  previewImg.classList.add("previewImg");
  previewImg.src = blob;

  var deleteBtn = document.createElement("div");
  deleteBtn.innerText = "삭제";
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.addEventListener("click", function (e) {
    return deletePreview(newId);
  });

  var crop = document.createElement("div");
  crop.innerText = "수정";
  crop.classList.add("cropBtn");
  crop.addEventListener("click", function (e) {
    return openCrop(blob, newId);
  });

  var buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttonContainer");

  buttonContainer.append(crop);
  buttonContainer.append(deleteBtn);

  containerEl.append(previewImg);
  containerEl.append(buttonContainer);
};

var newImgToData = function newImgToData(file, newId) {
  file.id = newId;
  dataTransfer.items.add(file);
};

var deletePreview = function deletePreview(id) {
  var ok = confirm("정말 삭제하시겠습니가?");
  if (ok) {
    var container = document.getElementById(id);
    container.remove();
    deleteImgDate(id);
  }
};

var deleteImgDate = function deleteImgDate(id) {
  var findIndexById = [].concat(_toConsumableArray(dataTransfer.files)).findIndex(function (file) {
    return file.id === id;
  });
  dataTransfer.items.remove(findIndexById);
  fileInput.files = dataTransfer.files;
};

fileInput.addEventListener("change", handleChange);
closeBtn.addEventListener("click", closeModal);