const fileInput = document.querySelector("input[name=photos]");
const preview = document.getElementById("preview");
const fakeFileBtn = document.getElementById("fakeFileBtn");
const originalPreviews = document.querySelectorAll(".originalPreview");

const MAX_FILE = 6;

const dataTransfer = new DataTransfer();

const generateRandomId = () => {
  return Math.random().toString(16).slice(2);
};

const startLoading = (ele) => {
  ele.innerHTML = "";
  if (ele.classList.contains("fa-pen")) {
    ele.classList.remove("fa-pen");
    ele.classList.add("fa-spinner");
    ele.classList.add("fa-spin-pulse");
    return;
  }
  ele.innerHTML = `<i class="fa-solid fa-spinner fa-spin-pulse"></i>`;
  ele.disabled = true;
};

const endLoading = (ele) => {
  ele.innerHTML = "";
  ele.innerHTML = `<i class="fa-solid fa-plus"></i>`;
  ele.disabled = false;
};

const compressFile = async (file) => {
  const compressOption = {
    maxSizeMB: 1,
    maxWidthOrHeight: 960,
    initialQuality: 0.8,
    useWebWorker: false,
  };
  try {
    if (dataTransfer.files.length >= MAX_FILE) {
      return;
    }

    let compressedBlob = await imageCompression(file, compressOption);
    compressedBlob.name = `${file.name || "힙합"}_compressed`;

    const convertFile = convertBlobToFile(compressedBlob);

    return convertFile;
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

  const updatePreview = (id, btn) => {
    const input = document.createElement("input");
    input.type = "file";
    input.click();
    input.addEventListener("change", (e) => updateChange(e, id, btn));
  };
  const deleteBtn = document.createElement("div");
  deleteBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  deleteBtn.addEventListener("click", (e) => {
    deletePreview(id);
  });
  const updateBtn = document.createElement("div");
  updateBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
  updateBtn.addEventListener("click", (e) => {
    updatePreview(id, e.target);
  });
  return { deleteBtn, updateBtn };
};

const paintUpdatePreview = (file, targetId) => {
  const container = document.getElementById(targetId);
  container.id = file.id;
  const img = container.childNodes[0];
  const url = URL.createObjectURL(file);
  img.src = url;
  const btnContainer = container.childNodes[1];
  btnContainer.innerHTML = ``;

  const { deleteBtn, updateBtn } = generateBtns(file.id);

  btnContainer.append(updateBtn);
  btnContainer.append(deleteBtn);
};

const paintPreview = (imgSrc, id) => {
  const previewContainer = document.createElement("div");
  previewContainer.id = id;

  const btnContainer = document.createElement("div");

  const previewImg = document.createElement("img");

  const url = URL.createObjectURL(imgSrc);

  previewImg.onload = () => {
    URL.revokeObjectURL(url);
  };

  previewImg.src = url;

  previewContainer.classList.add("previewContainer");
  previewImg.classList.add("previewContainer__img");
  btnContainer.classList.add("previewContainer__btn");

  const { deleteBtn, updateBtn } = generateBtns(id);

  btnContainer.appendChild(updateBtn);
  btnContainer.appendChild(deleteBtn);

  previewContainer.appendChild(previewImg);
  previewContainer.appendChild(btnContainer);

  preview.append(previewContainer);
};

const addChange = async (event) => {
  const imgFiles = event.target.files;

  startLoading(fakeFileBtn);

  for (let i = 0; i < imgFiles.length; i++) {
    const newId = generateRandomId();
    const file = await compressFile(imgFiles[i]);
    if (file) {
      file.id = newId;

      paintPreview(file, newId);
      handleAddFile(file);
    }
  }

  if (dataTransfer.files.length >= MAX_FILE) {
    alert(`최대 ${MAX_FILE}장까지 업로드 가능합니다`);
  }
  endLoading(fakeFileBtn);
};

const updateChange = async (e, targetId, updateBtn) => {
  try {
    startLoading(updateBtn);

    const newId = generateRandomId();
    const file = await compressFile(e.target.files[0]);
    file.id = newId;

    handleUpdateFile(file, targetId);
  } catch (error) {
    console.log(error);
    alert("파일 수정 도중 오류발생");
    return;
  }
  return;
};

const handleAddFile = (file) => {
  dataTransfer.items.add(file);
  fileInput.files = dataTransfer.files;
};

const handleUpdateFile = (file, targetId) => {
  const updatedFiles = Array.from(dataTransfer.files).map((dataFile) => {
    if (targetId === dataFile.id) {
      paintUpdatePreview(file, dataFile.id);
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

const init = () => {
  fileInput.addEventListener("change", addChange);
  fakeFileBtn.addEventListener("click", (e) => {
    e.preventDefault();
    fileInput.click();
  });
  if (originalPreviews.length > 0) {
    const handleLoad = async () => {
      const paintPhoto = async (imageEle) => {
        const canvas = document.createElement("canvas");
        canvas.height = imageEle.naturalHeight;
        canvas.width = imageEle.naturalWidth;
        canvas.getContext("2d").drawImage(imageEle, 0, 0);
        try {
          const blob = await new Promise((resolve) =>
            canvas.toBlob((blob) => resolve(blob))
          );
          const file = convertBlobToFile(blob);
          const id = generateRandomId();
          file.id = id;
          paintPreview(file, id);
          handleAddFile(file);
        } catch (error) {
          console.log(error);
          alert("미리보기 생성 중 오류발생");
        }
      };

      for (let i = 0; i < originalPreviews.length; i++) {
        await paintPhoto(originalPreviews[i]);
      }
    };
    window.addEventListener("load", handleLoad);
  }
};

init();
