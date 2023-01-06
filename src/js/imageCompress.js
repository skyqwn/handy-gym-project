const fileInput = document.querySelector("input[type=file]");
const dataTransfer = new DataTransfer();
const preview = document.getElementById("preview");
const fakeFileBtn = document.getElementById("fakeFileBtn");
const originalPreviews = document.querySelectorAll(".originalPreview");

const generateRandomId = () => {
  return Math.random().toString(16).slice(2);
};

const updateChange = async (e, targetId) => {
  try {
    const file = await compressedFile(e.target.files[0]);
    const newId = generateRandomId();
    file.id = newId;
    handleUpdateFile(file, targetId);
  } catch (error) {
    console.log(error);
  }
};

const generateBtns = (id) => {
  const deletePreview = (id) => {
    const container = document.getElementById(id);
    container.remove();
    const findIndexById = [...dataTransfer.files].findIndex(
      (file) => file.id === id
    );
    dataTransfer.items.remove(findIndexById);
    fileInput.files = dataTransfer.files;
  };

  const updatePreview = (id) => {
    const input = document.createElement("input");
    input.type = "file";
    input.click();
    input.addEventListener("change", (e) => updateChange(e, id));
  };

  const deleteBtn = document.createElement("div");
  deleteBtn.innerHTML = `<i class="fa-solid fa-xmark fa-bg-white"></i>`;
  deleteBtn.addEventListener("click", () => {
    deletePreview(id);
  });

  const updateBtn = document.createElement("div");
  updateBtn.innerHTML = `<i class="fa-solid fa-pen fa-bg-white"></i>`;
  updateBtn.addEventListener("click", (e) => {
    updatePreview(id);
  });

  return { deleteBtn, updateBtn };
};

const convertBlobToFile = (blob) => {
  const convertFile = new File([blob], blob.name || "previews", {
    type: "images/*",
  });
  return convertFile;
};

const compressedFile = async (file) => {
  const compressOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 960,
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

const paintUpdatePreview = (file, targetId) => {
  const container = document.getElementById(targetId);
  container.id = file.id;
  const img = container.childNodes[1];
  const btnContainer = container.childNodes[0];

  btnContainer.innerHTML = ``;

  const { deleteBtn, updateBtn } = generateBtns(file.id);

  btnContainer.appendChild(updateBtn);
  btnContainer.appendChild(deleteBtn);
  img.src = URL.createObjectURL(file);
};

const handleUpdateFile = (file, targetId) => {
  const updatedFiles = Array.from(dataTransfer.files).map((dataFile) => {
    if (dataFile.id === targetId) {
      paintUpdatePreview(file, targetId);
      return file;
    }

    return dataFile;
  });

  dataTransfer.items.clear();
  for (let i = 0; i < updatedFiles.length; i++) {
    dataTransfer.items.add(updatedFiles[i]);
  }
  fileInput.files = dataTransfer.files;
};

const paintPreview = (imgSrc, id) => {
  const previewContainer = document.createElement("div");
  previewContainer.id = id;
  const previewImg = document.createElement("img");

  const btnContainer = document.createElement("div");
  const { deleteBtn, updateBtn } = generateBtns(id);
  const compressedUrl = window.URL.createObjectURL(imgSrc);
  previewImg.src = compressedUrl;

  previewContainer.classList.add("previewContainer");
  previewImg.classList.add("previewContainer__img");
  btnContainer.classList.add("previewContainer__btn");

  btnContainer.append(updateBtn);
  btnContainer.append(deleteBtn);
  previewContainer.append(btnContainer);
  previewContainer.append(previewImg);
  preview.append(previewContainer);
};

const handleAddFile = (file) => {
  dataTransfer.items.add(file);
  fileInput.files = dataTransfer.files;
};

const handleChange = async (e) => {
  const imageFiles = e.target.files;

  for (let i = 0; i < imageFiles.length; i++) {
    const randomId = generateRandomId();
    const file = await compressedFile(imageFiles[i]);
    file.id = randomId;

    paintPreview(file, randomId);
    handleAddFile(file);
  }

  if (dataTransfer.files.length >= 6) {
    return alert("사진은 6장까지 업로드 가능합니다. ");
  }
};

const init = () => {
  fileInput.addEventListener("change", handleChange);

  fakeFileBtn.addEventListener("click", () => {
    fileInput.click();
  });

  if (originalPreviews.length > 0) {
    const handleLoad = async () => {
      const paintPhoto = async (imgEle) => {
        let canvas = document.createElement("canvas");
        canvas.width = imgEle.naturalWidth;
        canvas.height = imgEle.naturalHeight;

        let context = canvas.getContext("2d");

        context.drawImage(imgEle, 0, 0);

        const blob = await new Promise((resolve) =>
          canvas.toBlob((blob) => resolve(blob))
        );
        const file = convertBlobToFile(blob);
        const randomId = generateRandomId();
        file.id = randomId;
        paintPreview(file, randomId);
        handleAddFile(file);
      };
      for (let i = 0; originalPreviews.length > i; i++) {
        await paintPhoto(originalPreviews[i]);
      }
    };
    window.addEventListener("load", handleLoad);
  }
};

init();
