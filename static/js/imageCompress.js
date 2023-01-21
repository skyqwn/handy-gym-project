"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fileInput = document.querySelector("input[name=photos]");
var preview = document.getElementById("preview");
var fakeFileBtn = document.getElementById("fakeFileBtn");
var originalPreviews = document.querySelectorAll(".originalPreview");

var MAX_FILE = 6;

var dataTransfer = new DataTransfer();

var generateRandomId = function generateRandomId() {
  return Math.random().toString(16).slice(2);
};

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
  ele.innerHTML = "<i class=\"fa-solid fa-plus\"></i>";
  ele.disabled = false;
};

var compressFile = async function compressFile(file) {
  var compressOption = {
    maxSizeMB: 1,
    maxWidthOrHeight: 960,
    initialQuality: 0.8,
    useWebWorker: false
  };
  try {
    if (dataTransfer.files.length >= MAX_FILE) {
      return;
    }

    var compressedBlob = await imageCompression(file, compressOption);
    compressedBlob.name = (file.name || "힙합") + "_compressed";

    var convertFile = convertBlobToFile(compressedBlob);

    return convertFile;
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

  var updatePreview = function updatePreview(id, btn) {
    var input = document.createElement("input");
    input.type = "file";
    input.click();
    input.addEventListener("change", function (e) {
      return updateChange(e, id, btn);
    });
  };
  var deleteBtn = document.createElement("div");
  deleteBtn.innerHTML = "<i class=\"fa-solid fa-xmark\"></i>";
  deleteBtn.addEventListener("click", function (e) {
    deletePreview(id);
  });
  var updateBtn = document.createElement("div");
  updateBtn.innerHTML = "<i class=\"fa-solid fa-pen\"></i>";
  updateBtn.addEventListener("click", function (e) {
    updatePreview(id, e.target);
  });
  return { deleteBtn: deleteBtn, updateBtn: updateBtn };
};

var paintUpdatePreview = function paintUpdatePreview(file, targetId) {
  var container = document.getElementById(targetId);
  container.id = file.id;
  var img = container.childNodes[0];
  var url = URL.createObjectURL(file);
  img.src = url;
  var btnContainer = container.childNodes[1];
  btnContainer.innerHTML = "";

  var _generateBtns = generateBtns(file.id),
      deleteBtn = _generateBtns.deleteBtn,
      updateBtn = _generateBtns.updateBtn;

  btnContainer.append(updateBtn);
  btnContainer.append(deleteBtn);
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
  previewImg.classList.add("previewContainer__img");
  btnContainer.classList.add("previewContainer__btn");

  var _generateBtns2 = generateBtns(id),
      deleteBtn = _generateBtns2.deleteBtn,
      updateBtn = _generateBtns2.updateBtn;

  btnContainer.appendChild(updateBtn);
  btnContainer.appendChild(deleteBtn);

  previewContainer.appendChild(previewImg);
  previewContainer.appendChild(btnContainer);

  preview.append(previewContainer);
};

var addChange = async function addChange(event) {
  var imgFiles = event.target.files;

  startLoading(fakeFileBtn);

  for (var i = 0; i < imgFiles.length; i++) {
    var newId = generateRandomId();
    var file = await compressFile(imgFiles[i]);
    if (file) {
      file.id = newId;

      paintPreview(file, newId);
      handleAddFile(file);
    }
  }

  if (dataTransfer.files.length >= MAX_FILE) {
    alert("\uCD5C\uB300 " + MAX_FILE + "\uC7A5\uAE4C\uC9C0 \uC5C5\uB85C\uB4DC \uAC00\uB2A5\uD569\uB2C8\uB2E4");
  }
  endLoading(fakeFileBtn);
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

var handleAddFile = function handleAddFile(file) {
  dataTransfer.items.add(file);
  fileInput.files = dataTransfer.files;
};

var handleUpdateFile = function handleUpdateFile(file, targetId) {
  var updatedFiles = Array.from(dataTransfer.files).map(function (dataFile) {
    if (targetId === dataFile.id) {
      paintUpdatePreview(file, dataFile.id);
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

var init = function init() {
  fileInput.addEventListener("change", addChange);
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
          handleAddFile(file);
        } catch (error) {
          console.log(error);
          alert("미리보기 생성 중 오류발생");
        }
      };

      for (var i = 0; i < originalPreviews.length; i++) {
        await paintPhoto(originalPreviews[i]);
      }
    };
    window.addEventListener("load", handleLoad);
  }
};

init();