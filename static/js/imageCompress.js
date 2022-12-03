"use strict";

var fileInput = document.querySelector("input[type=file]");
var dataTransfer = new DataTransfer();

var handleImageUpload = function handleImageUpload(event) {
  var imageFiles = event.target.files;

  var compressOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 760,
    initalQuality: 0.8,
    useWebWorker: false
  };

  var compressFile = async function compressFile(file) {
    try {
      var compressedBlob = await imageCompression(file, compressOptions);
      compressedBlob.name = file.name + "_compressed";

      console.log(compressedBlob);

      var compressedFile = new File([compressedBlob], compressedBlob.name, {
        type: "image/*"
      });

      dataTransfer.items.add(compressedFile);
      fileInput.files = dataTransfer.files;
    } catch (error) {
      console.log(error);
      return alert("오류");
    }
  };

  for (var i = 0; i < imageFiles.length; i++) {
    compressFile(imageFiles[i]);
  }
};

fileInput.addEventListener("change", handleImageUpload);