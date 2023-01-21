const body = document.querySelector("body");
const modalContainer = document.querySelector(".modalContainer");
const modalWrapper = document.querySelector(".modalWrapper");
const croppperContainer = document.querySelector(".croppperContainer");
const closeBtn = document.getElementById("closeBtn");

const realFileInput = document.getElementById("realFileInput");
const fakeFileBtn = document.getElementById("fakeFileBtn");
const fakeFileInput = document.getElementById("fakeFileInput");
const galleryPreview = document.getElementById("galleryPreview");
const result = document.querySelector(".result");
const saveBtn = document.querySelector(".save");

let cropper;

const dataTransfer = new DataTransfer();

const generateRandomId = () => {
  return Math.random().toString(16).slice(2);
};

const compressFile = async (file) => {
  const compressOption = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1280,
    initialQuality: 0.8,
    useWebWorker: false,
  };
  try {
    if (file) {
      fakeFileBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin-pulse"></i>`;
      fakeFileBtn.disabled = true;

      let compressedBlob = await imageCompression(file, compressOption);
      compressedBlob.name = `${file.name || "힙합"}_compressed`;

      const convertFile = convertBlobToFile(compressedBlob);

      return convertFile;
    }
  } catch (error) {
    console.log(error);
    alert("파일 올리는 도중 오류발생");
    return;
  }
};

const convertBlobToFile = (blob) => {
  const convertFile = new File([blob], blob.name || "preview", {
    type: "images/*",
  });

  return convertFile;
};

const openModal = () => {
  modalContainer.style.transform = "translateY(0)";
  modalWrapper.style.top = `${window.scrollY}px`;
  body.style.overflowY = "hidden";
};

const closeModal = () => {
  modalContainer.style.transform = "translateY(-100%)";
  body.style.overflowY = "scroll";
};

const generateBtnContainer = (newId, imgSrc) => {
  const btnContainer = document.createElement("div");
  btnContainer.classList.add("btnContainer");

  const cropBtn = document.createElement("div");
  cropBtn.innerText = "수정";
  cropBtn.classList.add("cropBtn");
  cropBtn.addEventListener("click", (e) => openCrop(imgSrc, newId));

  const changeBtn = document.createElement("div");
  changeBtn.innerText = "파일변경";
  changeBtn.classList.add("deleteBtn");
  changeBtn.addEventListener("click", (e) => changeFile(newId));

  const deleteBtn = document.createElement("div");
  deleteBtn.innerText = "삭제";
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.addEventListener("click", (e) => deletePreview(newId));

  btnContainer.append(changeBtn);
  btnContainer.append(cropBtn);
  btnContainer.append(deleteBtn);

  return btnContainer;
};

const paintPreview = (newId, data) => {
  const imgSrc = URL.createObjectURL(data.file);

  const container = document.createElement("div");
  container.id = newId;
  container.classList.add("previewContainer");

  const img = document.createElement("img");
  img.src = imgSrc;
  img.classList.add("previewImg");

  const btnContainer = generateBtnContainer(newId, imgSrc);

  const desc = document.createElement("textarea");
  desc.name = "captions";
  desc.placeholder = "사진에 대한 설명을 적어보세요. (선택사항)";

  if (data.caption) desc.value = data.caption;

  container.append(img);
  container.append(btnContainer);
  container.append(desc);

  galleryPreview.append(container);
};

const updatePreview = (targetId, newId, data) => {
  const imgSrc = URL.createObjectURL(data.file);

  const container = document.getElementById(targetId);
  container.innerHTML = "";
  container.id = newId;

  const img = document.createElement("img");
  img.src = imgSrc;
  img.classList.add("previewImg");

  const btnContainer = generateBtnContainer(newId, imgSrc);

  const desc = document.createElement("textarea");
  desc.name = "captions";
  desc.placeholder = "사진에 대한 설명을 적어보세요. (선택사항)";
  if (data.caption) desc.value = data.caption;

  container.append(img);
  container.append(btnContainer);
  container.append(desc);
};

const deletePreview = (targetId) => {
  const ok = confirm("정말 삭제하시겠습니까?");
  if (ok) {
    const container = document.getElementById(targetId);
    container.remove();
    deleteImgData(targetId);
  }
};

const cropSave = (e, targetId) => {
  e.preventDefault();
  cropper
    .getCroppedCanvas({
      minWidth: 256,
      minHeight: 256,
      maxWidth: 1280,
      maxHeight: 1280,
    })
    .toBlob((blob) => {
      const randomId = generateRandomId();

      const croppedFile = convertBlobToFile(blob);

      const caption = findCaption(targetId);

      const data = { file: croppedFile, caption };

      updatePreview(targetId, randomId, data);

      updateImgToData(croppedFile, targetId, randomId);

      closeModal();
    });
};

const openCrop = (imgSrc, targetId) => {
  openModal();

  croppperContainer.innerHTML = "";

  const img = document.createElement("img");
  img.src = imgSrc;

  const cropSaveBtn = document.createElement("div");
  cropSaveBtn.addEventListener("click", (e) => cropSave(e, targetId));
  cropSaveBtn.innerText = "저장";
  cropSaveBtn.classList.add("saveBtn");
  cropSaveBtn.classList.add("btn");
  croppperContainer.appendChild(img);
  modalWrapper.appendChild(cropSaveBtn);

  cropper = new Cropper(img, { aspectRatio: 4 / 3, zoomable: false });
};

const findCaption = (targetId) => {
  const container = document.getElementById(targetId);
  const textarea = container.querySelector("textarea");
  const caption = textarea.value;
  if (caption) {
    return caption;
  } else {
    return "";
  }
};

const changeFile = (id) => {
  const input = document.createElement("input");
  input.type = "file";
  input.click();
  input.addEventListener("change", async (e) => {
    const randomId = generateRandomId();
    const file = e.target.files[0];
    const compressedFile = await compressFile(file);
    const caption = findCaption(id);
    const data = { file: compressedFile, caption };
    updatePreview(id, randomId, data);
    updateImgToData(compressedFile, id, randomId);
  });
};

const newImgTodData = (file, newId) => {
  file.id = newId;

  dataTransfer.items.add(file);

  realFileInput.files = dataTransfer.files;
};

const updateImgToData = (file, targetId, newId) => {
  file.id = newId;

  const updatedFiles = Array.from(dataTransfer.files).map((dataFile) => {
    if (targetId === dataFile.id) {
      return file;
    }
    return dataFile;
  });

  dataTransfer.items.clear();

  for (let i = 0; i < updatedFiles.length; i++) {
    dataTransfer.items.add(updatedFiles[i]);
  }

  realFileInput.files = dataTransfer.files;
};

const deleteImgData = (id) => {
  const findIndexById = [...dataTransfer.files].findIndex(
    (file) => file.id === id
  );

  dataTransfer.items.remove(findIndexById);

  realFileInput.files = dataTransfer.files;
};

const handleChange = async (e) => {
  const file = e.target.files[0];

  const randomId = generateRandomId();

  const compressedFile = await compressFile(file);

  const data = { file: compressedFile, caption: "" };

  paintPreview(randomId, data);

  newImgTodData(compressedFile, randomId);

  fakeFileBtn.innerHTML = `<i class="fa-solid fa-plus" ></i>`;
  fakeFileBtn.disabled = false;
};

const init = () => {
  fakeFileBtn.addEventListener("click", (e) => {
    e.preventDefault();
    fakeFileInput.click();
  });
  fakeFileInput.addEventListener("change", handleChange);
  const originalPhotos = document.querySelectorAll(".originalPhoto");
  const originalCaptions = document.querySelectorAll(".originalCaption");
  if (originalPhotos.length > 0) {
    const handleLoad = async () => {
      const paintOriginalPreview = async (photoEle, captionEle) => {
        const canvas = document.createElement("canvas");
        canvas.height = photoEle.naturalHeight;
        canvas.width = photoEle.naturalWidth;
        canvas.getContext("2d").drawImage(photoEle, 0, 0);
        try {
          const randomId = generateRandomId();

          const blob = await new Promise((resolve) =>
            canvas.toBlob((blob) => resolve(blob))
          );

          const file = convertBlobToFile(blob);
          file.id = randomId;

          const caption = captionEle.value;

          const data = { file, caption };

          paintPreview(randomId, data);

          newImgTodData(file, randomId);
        } catch (error) {
          console.log(error);
          alert("미리보기 생성 중 오류발생");
        }
      };

      for (let i = 0; i < originalPhotos.length; i++) {
        await paintOriginalPreview(originalPhotos[i], originalCaptions[i]);
      }
    };
    window.addEventListener("load", handleLoad);
  }
  closeBtn.addEventListener("click", closeModal);
};

init();
