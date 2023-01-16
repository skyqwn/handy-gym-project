"use strict";

var fileInput = document.querySelector("input[name=avatar]");
var fakeFileInput = document.getElementById("fakeFileInput");

var avatarBtn = document.getElementById("fileBtn");
var deleteBtn = document.getElementById("deleteBtn");

var avatarImg = document.getElementById("jsAvatarImg");

var dataTransfer = new DataTransfer();

var noUserImgSrc = "";

var paintPreview = function paintPreview(file) {
  var imgSrc = URL.createObjectURL(file);

  avatarImg.src = imgSrc;
};

var addFile = function addFile(file) {
  dataTransfer.clearData();

  dataTransfer.items.add(file);

  fileInput.files = dataTransfer.files;
};

var removeFile = function removeFile() {
  dataTransfer.clearData();
  fileInput.files = dataTransfer.files;
};

var convertBlobToFile = function convertBlobToFile(blob) {
  var convertFile = new File([blob], blob.name || "preview", {
    type: "image/*"
  });

  return convertFile;
};

var compressFile = async function compressFile(file) {
  var compressOption = {
    maxSizeMB: 1,
    maxWidthOrHeight: 110,
    initialQuality: 0.9,
    useWebWorker: false
  };
  try {
    var compressedBlob = await imageCompression(file, compressOption);
    compressedBlob.name = file.name + "_compressed";

    var convertFile = convertBlobToFile(compressedBlob);

    return convertFile;
  } catch (error) {
    console.log(error);
    alert("파일 업로드중 오류발생!");
    return;
  }
};

var imgSrcToFile = async function imgSrcToFile(imageEle) {
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
    return convertBlobToFile(blob);
  } catch (error) {
    console.log(error);
  }
};

var fakeHandleFile = async function fakeHandleFile(e) {
  var file = e.target.files[0];

  if (file) {
    var compressedFile = await compressFile(file);

    paintPreview(compressedFile);

    addFile(compressedFile);
  }
};

var init = function init() {
  var originalImg = document.getElementById("originalImg");
  var noUserImg = document.getElementById("noUserImg");

  var handleLoad = async function handleLoad() {
    avatarBtn.addEventListener("click", function (e) {
      fakeFileInput.click();
    });
    deleteBtn.addEventListener("click", function (e) {
      avatarImg.src = noUserImgSrc;

      removeFile();
    });

    fakeFileInput.addEventListener("change", fakeHandleFile);

    if (originalImg) {
      var originalImgFile = await imgSrcToFile(originalImg);
      addFile(originalImgFile);
    }
    var noUserImgFile = await imgSrcToFile(noUserImg);
    var noUserImgUrl = URL.createObjectURL(noUserImgFile);
    noUserImgSrc = noUserImgUrl;
  };
  window.addEventListener("load", handleLoad);
};

init();