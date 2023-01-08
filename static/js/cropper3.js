"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var body = document.querySelector("body");
var modalContainer = document.querySelector(".modalContainer");
var modalWrapper = document.querySelector(".modalWrapper");
var cropperContainer = document.querySelector(".cropperContainer");
var originalPreviews = document.querySelectorAll(".originalPreview");
var originalCaptions = document.querySelectorAll(".originalCaption");

var realFileInput = document.getElementById("realFileInput");
var fakeFileInput = document.getElementById("fakeFileInput");
var galleryPreview = document.getElementById("galleryPreview");
var closeBtn = document.getElementById("closeBtn");

var cropper = void 0;

var dataTransfer = new DataTransfer();

var generateRandomId = function generateRandomId() {
  return Math.random().toString(16).slice(2);
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

var convertBlobToFile = function convertBlobToFile(blob) {
  var convertFile = new File([blob], blob.name || "previews", {
    type: "images/*"
  });
  return convertFile;
};

// const containerCreateOrFind = (id) => {
//   const existsContainer = document.getElementById(id);
//   if (existsContainer) {
//     return existsContainer;
//   } else {
//     const container = document.createElement("div");
//     container.id = id;
//     return container;
//   }
// };

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
  realFileInput.files = dataTransfer.files;
};

var cropSave = function cropSave(e, id) {
  e.preventDefault();
  cropper.getCroppedCanvas({
    minWidth: 256,
    minHeight: 256,
    maxWidth: 4096,
    maxHeight: 4096
  }).toBlob(function (blob) {
    var randomId = generateRandomId();

    var previewContainer = document.getElementById(id);

    var textareaValue = previewContainer.querySelector("textarea").value;

    previewContainer.innerHTML = "";
    previewContainer.id = randomId;

    paintPreview(previewContainer, blob, randomId, textareaValue);

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

var handleChange = async function handleChange(e) {
  var imageFile = e.target.files[0];

  var randomId = Math.random().toString(16).slice(2);
  var file = await compressFile(imageFile);
  var previewContainer = document.createElement("div");

  previewContainer.id = randomId;
  previewContainer.classList.add("previewContainer");

  paintPreview(previewContainer, file, randomId, "");

  galleryPreview.append(previewContainer);

  newImgToData(file, randomId);
  // for (let i = 0; i < imageFile.length; i++) {
  // }
};

var paintPreview = function paintPreview(containerEl, file, newId, textareaValue) {
  var blob = window.URL.createObjectURL(file);

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

  var desc = document.createElement("textarea");
  desc.name = "captions";
  desc.placeholder = "사진에 대한 설명을 해주세요";
  if (textareaValue) desc.value = textareaValue;

  buttonContainer.append(crop);
  buttonContainer.append(deleteBtn);

  containerEl.append(previewImg);
  containerEl.append(buttonContainer);
  containerEl.append(desc);
};

var newImgToData = function newImgToData(file, newId) {
  file.id = newId;
  dataTransfer.items.add(file);
  realFileInput.files = dataTransfer.files;
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
  realFileInput.files = dataTransfer.files;
};

// realFileInput.addEventListener("change", handleChange);

var init = function init() {
  fakeFileInput.addEventListener("change", handleChange);
  // closeBtn.addEventListener("click", closeModal);

  if (originalPreviews.length > 0) {
    var handleLoad = async function handleLoad() {
      var paintPhoto = async function paintPhoto(imgEle, captionEle) {
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
        var captionValue = captionEle.value;
        var randomId = generateRandomId();

        console.log(file);

        newImgToData(file, randomId);

        var container = document.createElement("div");
        container.id = randomId;
        container.classList.add("previewContainer");
        paintPreview(container, file, randomId, captionValue);
        galleryPreview.append(container);
      };
      for (var i = 0; originalPreviews.length > i; i++) {
        await paintPhoto(originalPreviews[i], originalCaptions[i]);
      }
    };
    window.addEventListener("load", handleLoad);
  }
};

init();