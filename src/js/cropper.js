const body = document.querySelector("body");
const modalContainer = document.querySelector(".modalContainer");
const modal = document.querySelector(".modal");
const modalItem = document.querySelector(".modal__item");

const fileInput = document.querySelector("input[type=file]");
const galleryPreview = document.getElementById("galleryPreview");

let cropper;

const dataTransfer = new DataTransfer();

const cropSave = (e, id) => {
  e.preventDefault();
  cropper
    .getCroppedCanvas({
      minWidth: 256,
      minHeight: 256,
      maxWidth: 4096,
      maxHeight: 4096,
    })
    .toBlob((blob) => {
      const randomId = Math.random().toString(16).slice(2);
      const img = document.getElementById(id);
      console.log(img);
      img.src = URL.createObjectURL(blob);
      img.id = randomId;

      //
      const convertFile = new File([blob], blob.name || "cropedImg", {
        type: "images/*",
      });
      const updatedFiles = Array.from(dataTransfer.files).map((dataFile) => {
        if (dataFile.id === id) {
          return convertFile;
        }

        return dataFile;
      });

      dataTransfer.items.clear();
      for (let i = 0; i < updatedFiles.length; i++) {
        dataTransfer.items.add(updatedFiles[i]);
      }
      fileInput.files = dataTransfer.files;
      closeCrop();
    });
};

const openCrop = (imgSrc, id) => {
  modalContainer.style.transform = "translateY(0)";
  modal.style.top = `${window.scrollY}px`;
  body.style.overflowY = "hidden";

  const img = document.createElement("img");
  img.src = imgSrc;
  cropper = new Cropper(img);
  const cropSaveBtn = document.createElement("div");
  cropSaveBtn.innerText = "수정";
  cropSaveBtn.addEventListener("click", (e) => cropSave(e, id));
  modalItem.append(img);
  modalItem.append(cropSaveBtn);
};

const closeCrop = (e) => {
  modalContainer.style.transform = "translateY(-100%)";
  body.style.overflowY = "scroll";
  if (e.target === modalContainer) {
  }
};

const handleChange = (e) => {
  const imageFiles = e.target.files;

  for (let i = 0; i < imageFiles.length; i++) {
    const randomId = Math.random().toString(16).slice(2);

    const file = imageFiles[i];
    file.id = randomId;

    dataTransfer.items.add(file);
    console.log(dataTransfer.files);

    const blob = window.URL.createObjectURL(file);
    const previewContainer = document.createElement("div");

    const previewImg = document.createElement("img");
    previewImg.id = randomId;
    previewImg.src = blob;

    const editBtn = document.createElement("div");
    editBtn.innerText = "수정";
    editBtn.addEventListener("click", (e) => openCrop(blob, randomId));
    previewContainer.append(previewImg);
    previewContainer.append(editBtn);
    galleryPreview.append(previewContainer);
  }
};

fileInput.addEventListener("change", handleChange);
// modalContainer.addEventListener("click", closeCrop);
