const body = document.querySelector("body");
const modalContainer = document.querySelector(".modalContainer");
const modalWrapper = document.querySelector(".modalWrapper");
const cropperContainer = document.querySelector(".cropperContainer");
const originalPreviews = document.querySelectorAll(".originalPreview");
const originalCaptions = document.querySelectorAll(".originalCaption");

const realFileInput = document.getElementById("realFileInput");
const fakeFileInput = document.getElementById("fakeFileInput");
const galleryPreview = document.getElementById("galleryPreview");
const closeBtn = document.getElementById("closeBtn");

let cropper;

const dataTransfer = new DataTransfer();

const generateRandomId = () => {
  return Math.random().toString(16).slice(2);
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

const convertBlobToFile = (blob) => {
  const convertFile = new File([blob], blob.name || "previews", {
    type: "images/*",
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
  realFileInput.files = dataTransfer.files;
  console.log(realFileInput.files);
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

      const textareaValue = previewContainer.querySelector("textarea").value;

      previewContainer.innerHTML = "";
      previewContainer.id = randomId;

      paintPreview(previewContainer, blob, randomId, textareaValue);

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

const handleChange = async (e) => {
  const imageFile = e.target.files[0];

  const randomId = Math.random().toString(16).slice(2);
  const file = await compressFile(imageFile);
  const previewContainer = document.createElement("div");

  previewContainer.id = randomId;
  previewContainer.classList.add("previewContainer");

  paintPreview(previewContainer, file, randomId, "");

  galleryPreview.append(previewContainer);

  newImgToData(file, randomId);
  // for (let i = 0; i < imageFile.length; i++) {
  // }
};

const paintPreview = (containerEl, file, newId, textareaValue) => {
  const blob = window.URL.createObjectURL(file);

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

  const desc = document.createElement("textarea");
  desc.name = "captions";
  desc.placeholder = "사진에 대한 설명을 해주세요";
  if (textareaValue) desc.value = textareaValue;

  buttonContainer.append(crop);
  buttonContainer.append(deleteBtn);

  containerEl.append(previewImg);
  containerEl.append(buttonContainer);
  containerEl.append(desc);
};

const newImgToData = (file, newId) => {
  file.id = newId;
  dataTransfer.items.add(file);
  realFileInput.files = dataTransfer.files;
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
  realFileInput.files = dataTransfer.files;
};

// realFileInput.addEventListener("change", handleChange);

const init = () => {
  fakeFileInput.addEventListener("change", handleChange);
  // closeBtn.addEventListener("click", closeModal);

  if (originalPreviews.length > 0) {
    const handleLoad = async () => {
      const paintPhoto = async (imgEle, captionEle) => {
        let canvas = document.createElement("canvas");
        canvas.width = imgEle.naturalWidth;
        canvas.height = imgEle.naturalHeight;

        let context = canvas.getContext("2d");

        context.drawImage(imgEle, 0, 0);

        const blob = await new Promise((resolve) =>
          canvas.toBlob((blob) => resolve(blob))
        );
        const file = convertBlobToFile(blob);
        const captionValue = captionEle.value;
        const randomId = generateRandomId();

        newImgToData(file, randomId);

        const container = document.createElement("div");
        container.id = randomId;
        container.classList.add("previewContainer");
        paintPreview(container, file, randomId, captionValue);
        galleryPreview.append(container);
      };
      for (let i = 0; originalPreviews.length > i; i++) {
        await paintPhoto(originalPreviews[i], originalCaptions[i]);
      }
    };
    window.addEventListener("load", handleLoad);
  }
};

init();
