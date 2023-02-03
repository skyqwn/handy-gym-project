"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var body = document.querySelector("body");
var modalContainer = document.querySelector(".modalContainer");
var modalWrapper = document.querySelector(".modalWrapper");
var croppperContainer = document.querySelector(".croppperContainer");
var closeBtn = document.getElementById("closeBtn");

var realFileInput = document.getElementById("realFileInput");
var fakeFileBtn = document.getElementById("fakeFileBtn");
var fakeFileInput = document.getElementById("fakeFileInput");
var galleryPreview = document.getElementById("galleryPreview");
var result = document.querySelector(".result");
var saveBtn = document.querySelector(".save");

var cropper = void 0;

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
  ele.disabled = true;
};

var endLoading = function endLoading(ele) {
  ele.innerHTML = "";
  ele.innerHTML = "<i class=\"fa-solid fa-camera\" ></i>";
  ele.disabled = false;
};

var generateRandomId = function generateRandomId() {
  return Math.random().toString(16).slice(2);
};

var compressFile = async function compressFile(file) {
  var compressOption = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1280,
    initialQuality: 0.8,
    useWebWorker: false
  };
  try {
    if (file) {
      var compressedBlob = await imageCompression(file, compressOption);
      compressedBlob.name = (file.name || "힙합") + "_compressed";

      var convertFile = convertBlobToFile(compressedBlob);

      return convertFile;
    }
  } catch (error) {
    console.log(error);
    alert("파일 올리는 도중 오류발생");
    return;
  }
};

var convertBlobToFile = function convertBlobToFile(blob) {
  var convertFile = new File([blob], blob.name || "preview", {
    type: "images/*"
  });

  return convertFile;
};

var openModal = function openModal() {
  modalContainer.style.transform = "translateY(0)";
  modalWrapper.style.top = window.scrollY + "px";
  body.style.overflowY = "hidden";
};

var closeModal = function closeModal() {
  modalContainer.style.transform = "translateY(-100%)";
  body.style.overflowY = "scroll";
};

var generateBtnContainer = function generateBtnContainer(newId, imgSrc) {
  var btnContainer = document.createElement("div");
  btnContainer.classList.add("previewContainer__btn");

  var cropBtn = document.createElement("div");
  cropBtn.innerHTML = "<i class=\"fa-solid fa-crop-simple\"></i>";
  cropBtn.classList.add("cropBtn");
  cropBtn.addEventListener("click", function (e) {
    return openCrop(imgSrc, newId);
  });

  var changeBtn = document.createElement("div");
  changeBtn.innerHTML = "<i class=\"fa-solid fa-pen\"></i>";
  changeBtn.classList.add("deleteBtn");
  changeBtn.addEventListener("click", function (e) {
    return changeFile(newId, e.target);
  });

  var deleteBtn = document.createElement("div");
  deleteBtn.innerHTML = "<i class=\"fa-solid fa-xmark\"></i>";
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.addEventListener("click", function (e) {
    return deletePreview(newId);
  });

  btnContainer.append(changeBtn);
  btnContainer.append(cropBtn);
  btnContainer.append(deleteBtn);

  return btnContainer;
};

var paintPreview = function paintPreview(newId, data) {
  var imgSrc = URL.createObjectURL(data.file);

  var container = document.createElement("div");
  container.id = newId;
  container.classList.add("previewContainer");
  container.classList.add("galleryPreview");

  var img = document.createElement("img");
  img.src = imgSrc;
  img.classList.add("previewContainer__img");

  var btnContainer = generateBtnContainer(newId, imgSrc);

  var desc = document.createElement("textarea");
  desc.name = "captions";
  desc.placeholder = "사진에 대한 설명을 적어보세요. (선택사항)";

  if (data.caption) desc.value = data.caption;

  container.append(img);
  container.append(btnContainer);
  container.append(desc);

  galleryPreview.append(container);
};

var updatePreview = function updatePreview(targetId, newId, data) {
  var imgSrc = URL.createObjectURL(data.file);

  var container = document.getElementById(targetId);
  container.innerHTML = "";
  container.id = newId;

  var img = document.createElement("img");
  img.src = imgSrc;
  img.classList.add("previewContainer__img");

  var btnContainer = generateBtnContainer(newId, imgSrc);

  var desc = document.createElement("textarea");
  desc.name = "captions";
  desc.placeholder = "사진에 대한 설명을 적어보세요. (선택사항)";
  if (data.caption) desc.value = data.caption;

  container.append(img);
  container.append(btnContainer);
  container.append(desc);
};

var deletePreview = function deletePreview(targetId) {
  var ok = confirm("정말 삭제하시겠습니까?");
  if (ok) {
    var container = document.getElementById(targetId);
    container.remove();
    deleteImgData(targetId);
  }
};

var cropSave = function cropSave(e, targetId) {
  e.preventDefault();
  cropper.getCroppedCanvas({
    minWidth: 256,
    minHeight: 256,
    maxWidth: 1280,
    maxHeight: 1280
  }).toBlob(function (blob) {
    var randomId = generateRandomId();

    var croppedFile = convertBlobToFile(blob);

    var caption = findCaption(targetId);

    var data = { file: croppedFile, caption: caption };

    updatePreview(targetId, randomId, data);

    updateImgToData(croppedFile, targetId, randomId);

    closeModal();
  });
};

var openCrop = function openCrop(imgSrc, targetId) {
  openModal();

  croppperContainer.innerHTML = "";

  var img = document.createElement("img");
  img.src = imgSrc;

  var cropSaveBtn = document.createElement("div");
  cropSaveBtn.addEventListener("click", function (e) {
    return cropSave(e, targetId);
  });
  cropSaveBtn.innerText = "저장";
  cropSaveBtn.classList.add("saveBtn");
  cropSaveBtn.classList.add("btn");
  croppperContainer.appendChild(img);
  modalWrapper.appendChild(cropSaveBtn);

  cropper = new Cropper(img, { aspectRatio: 4 / 3, zoomable: false });
};

var findCaption = function findCaption(targetId) {
  var container = document.getElementById(targetId);
  var textarea = container.querySelector("textarea");
  var caption = textarea.value;
  if (caption) {
    return caption;
  } else {
    return "";
  }
};

var changeFile = function changeFile(id, btn) {
  var input = document.createElement("input");
  input.type = "file";
  input.click();
  input.addEventListener("change", async function (e) {
    var randomId = generateRandomId();
    var file = e.target.files[0];
    startLoading(btn);
    var compressedFile = await compressFile(file);
    var caption = findCaption(id);
    var data = { file: compressedFile, caption: caption };
    updatePreview(id, randomId, data);
    updateImgToData(compressedFile, id, randomId);
  });
};

var newImgTodData = function newImgTodData(file, newId) {
  file.id = newId;

  dataTransfer.items.add(file);

  realFileInput.files = dataTransfer.files;
};

var updateImgToData = function updateImgToData(file, targetId, newId) {
  file.id = newId;

  var updatedFiles = Array.from(dataTransfer.files).map(function (dataFile) {
    if (targetId === dataFile.id) {
      return file;
    }
    return dataFile;
  });

  dataTransfer.items.clear();

  for (var i = 0; i < updatedFiles.length; i++) {
    dataTransfer.items.add(updatedFiles[i]);
  }

  realFileInput.files = dataTransfer.files;
};

var deleteImgData = function deleteImgData(id) {
  var findIndexById = [].concat(_toConsumableArray(dataTransfer.files)).findIndex(function (file) {
    return file.id === id;
  });

  dataTransfer.items.remove(findIndexById);

  realFileInput.files = dataTransfer.files;
};

var handleChange = async function handleChange(e) {
  var file = e.target.files[0];

  var randomId = generateRandomId();

  startLoading(fakeFileBtn);

  var compressedFile = await compressFile(file);

  var data = { file: compressedFile, caption: "" };

  paintPreview(randomId, data);

  newImgTodData(compressedFile, randomId);

  endLoading(fakeFileBtn);
};

var init = function init() {
  fakeFileBtn.addEventListener("click", function (e) {
    e.preventDefault();
    fakeFileInput.click();
  });
  fakeFileInput.addEventListener("change", handleChange);
  var originalPhotos = document.querySelectorAll(".originalPhoto");
  var originalCaptions = document.querySelectorAll(".originalCaption");
  if (originalPhotos.length > 0) {
    var handleLoad = async function handleLoad() {
      var paintOriginalPreview = async function paintOriginalPreview(photoEle, captionEle) {
        var canvas = document.createElement("canvas");
        canvas.height = photoEle.naturalHeight;
        canvas.width = photoEle.naturalWidth;
        canvas.getContext("2d").drawImage(photoEle, 0, 0);
        try {
          var randomId = generateRandomId();

          var blob = await new Promise(function (resolve) {
            return canvas.toBlob(function (blob) {
              return resolve(blob);
            });
          });

          var file = convertBlobToFile(blob);
          file.id = randomId;

          var caption = captionEle.value;

          var data = { file: file, caption: caption };

          paintPreview(randomId, data);

          newImgTodData(file, randomId);
        } catch (error) {
          console.log(error);
          alert("미리보기 생성 중 오류발생");
        }
      };

      for (var i = 0; i < originalPhotos.length; i++) {
        await paintOriginalPreview(originalPhotos[i], originalCaptions[i]);
      }
    };
    window.addEventListener("load", handleLoad);
  }
  closeBtn.addEventListener("click", closeModal);
};

init();