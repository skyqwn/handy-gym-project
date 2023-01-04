const body = document.querySelector("body");
const modalContainer = document.querySelector(".modalContainer");
const modalWrapper = document.querySelector(".modalWrapper");
const cropperContainer = document.querySelector(".cropperContainer");

const fileInput = document.querySelector("input[type=file]");
const galleryPreview = document.getElementById("galleryPreview");

const closeBtn = document.getElementById("closeBtn");

let cropper;

const dataTransfer = new DataTransfer();

const cropImgToData = (blob, targetId, newId) => {
  const convertFile = new File([blob], blob.name || "cropedImg", {
    type: "images/*",
  });
  convertFile.id = newId;
  const updatedFiles = Array.from(dataTransfer.files).map((dataFile) => {
    if (dataFile.id === targetId) {
      return convertFile;
    }

    return dataFile;
  });

  dataTransfer.items.clear();
  for (let i = 0; i < updatedFiles.length; i++) {
    dataTransfer.items.add(updatedFiles[i]);
  }
  fileInput.files = dataTransfer.files;
  console.log(fileInput.files);
};

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

      const previewContainer = document.getElementById(id);
      previewContainer.innerHTML = "";
      previewContainer.id = randomId;

      paintPreview(previewContainer, blob, randomId);

      cropImgToData(blob, id, randomId);

      closeModal();
    });
};

const openCrop = (imgSrc, id) => {
  modalContainer.style.transform = "translateY(0)";
  modalWrapper.style.top = `${window.scrollY}px`;
  body.style.overflowY = "hidden";
  cropperContainer.innerHTML = "";

  const img = document.createElement("img");
  img.src = imgSrc;
  cropper = new Cropper(img, { aspectRatio: 3 / 4, zoomable: false });
  const cropSaveBtn = document.createElement("div");
  cropSaveBtn.innerText = "수정";
  cropSaveBtn.addEventListener("click", (e) => cropSave(e, id));
  cropperContainer.append(img);
  cropperContainer.append(cropSaveBtn);
};

const closeModal = () => {
  modalContainer.style.transform = "translateY(-100%)";
  modalWrapper.style.top = "0";
  body.style.overflowY = "scroll";
};

const handleContainer = (e) => {
  if (e.target === modalContainer || e.target === cropperContainer) {
    closeModal();
  }
};

const convertBlobToFile = (blob) => {
  const convertFile = new File([blob], blob.name || "previews", {
    type: "images/*",
  });
  return convertFile;
};

const compressFile = async (file) => {
  const compressOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1280,
    initalQuality: 0.8,
    useWebWorker: false,
  };

  try {
    if (dataTransfer.files.length >= 6) {
      return;
    }

    let blob = await imageCompression(file, compressOptions);
    blob.name = `${file.name}_compressed`;
    const convertFile = convertBlobToFile(blob);
    return convertFile;
  } catch (error) {
    console.log(error);
    return alert("이미지 압축중 오류");
  }
};

const handleChange = async (e) => {
  const imageFiles = e.target.files;

  for (let i = 0; i < imageFiles.length; i++) {
    const randomId = Math.random().toString(16).slice(2);
    const file = await compressFile(imageFiles[i]);
    const previewContainer = document.createElement("div");

    previewContainer.id = randomId;
    previewContainer.classList.add("previewContainer");

    paintPreview(previewContainer, file, randomId);

    galleryPreview.append(previewContainer);

    newImgToData(file, randomId);
  }
};

const paintPreview = (containerEl, file, newId) => {
  const blob = window.URL.createObjectURL(file);
  console.log(blob);

  const previewImg = document.createElement("img");
  previewImg.classList.add("previewImg");
  previewImg.src = blob;

  const deleteBtn = document.createElement("div");
  deleteBtn.innerText = "삭제";
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.addEventListener("click", (e) => deletePreview(newId));

  const crop = document.createElement("div");
  crop.innerText = "수정";
  crop.classList.add("cropBtn");
  crop.addEventListener("click", (e) => openCrop(blob, newId));

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttonContainer");

  buttonContainer.append(crop);
  buttonContainer.append(deleteBtn);

  containerEl.append(previewImg);
  containerEl.append(buttonContainer);
};

const newImgToData = (file, newId) => {
  file.id = newId;
  dataTransfer.items.add(file);
};

const deletePreview = (id) => {
  const ok = confirm("정말 삭제하시겠습니가?");
  if (ok) {
    const container = document.getElementById(id);
    container.remove();
    deleteImgDate(id);
  }
};

const deleteImgDate = (id) => {
  const findIndexById = [...dataTransfer.files].findIndex(
    (file) => file.id === id
  );
  dataTransfer.items.remove(findIndexById);
  fileInput.files = dataTransfer.files;
};

fileInput.addEventListener("change", handleChange);
closeBtn.addEventListener("click", closeModal);
