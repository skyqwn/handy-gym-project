const fileInput = document.querySelector("input[type=file]");
const dataTransfer = new DataTransfer();
const preview = document.getElementById("preview");
const fakeFileBtn = document.getElementById("fakeFileBtn");
const originalPreviews = document.querySelectorAll(".originalPreview");

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
  input.addEventListener("change", (e) => handleChange(e, true, id));
};

const paintPreview = (imgSrc, id) => {
  const previewContainer = document.createElement("div");
  previewContainer.id = id;
  const previewImg = document.createElement("img");

  const btnContainer = document.createElement("div");

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

  const compressedUrl = window.URL.createObjectURL(imgSrc);
  previewImg.src = compressedUrl;

  previewContainer.classList.add("previewContainer");
  previewImg.classList.add("previewContainer__img");
  btnContainer.classList.add("previewContainer__btn");

  btnContainer.appendChild(updateBtn);
  btnContainer.appendChild(deleteBtn);
  previewContainer.append(btnContainer);
  previewContainer.append(previewImg);
  preview.appendChild(previewContainer);
};

const handleChange = async (event, isUpdate, id) => {
  const imageFiles = event.target.files;

  const compressOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 960,
    initalQuality: 0.8,
    useWebWorker: false,
  };

  const compressFile = async (file) => {
    try {
      if (dataTransfer.files.length >= 6) {
        return;
      }

      let compressedBlob = await imageCompression(file, compressOptions);
      compressedBlob.name = `${file.name}_compressed`;
      paintPreviewAndHandleDatatransfer(compressedBlob, isUpdate, id);
    } catch (error) {
      console.log(error);
      return alert("오류");
    }
  };

  for (let i = 0; i < imageFiles.length; i++) {
    await compressFile(imageFiles[i]);
  }

  if (dataTransfer.files.length >= 6) {
    return alert("사진은 6장까지 업로드 가능합니다.");
  }
};

const handleOriginalPreviews = async () => {
  const getBlob = async (imgEle) => {
    let canvas = document.createElement("canvas");
    canvas.width = imgEle.naturalWidth;
    canvas.height = imgEle.naturalHeight;

    let context = canvas.getContext("2d");

    context.drawImage(imgEle, 0, 0);

    const blob = await new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob))
    );
    paintPreviewAndHandleDatatransfer(blob);
  };

  for (let i = 0; i < originalPreviews.length; i++) {
    await getBlob(originalPreviews[i]);
  }
};

const paintPreviewAndHandleDatatransfer = (blob, isUpdate = false, id = "") => {
  const randomId = Math.random().toString(16).slice(2);

  const file = new File([blob], blob.name, {
    type: "image/*",
  }); //새로 압축된 파일

  file.id = randomId;
  if (isUpdate) {
    //다시볼것
    const updatedFiles = Array.from(dataTransfer.files).map((currentFile) => {
      if (currentFile.id === id) {
        const container = document.getElementById(id);
        container.id = randomId;
        const img = container.childNodes[1];
        const btnContainer = container.childNodes[0];

        btnContainer.innerHTML = ``;

        const deleteBtn = document.createElement("div");
        deleteBtn.innerHTML = `<i class="fa-solid fa-xmark fa-bg-white"></i>`;
        deleteBtn.addEventListener("click", () => {
          deletePreview(randomId);
        });

        const updateBtn = document.createElement("div");
        updateBtn.innerHTML = `<i class="fa-solid fa-pen fa-bg-white"></i>`;
        updateBtn.addEventListener("click", (e) => {
          updatePreview(randomId);
        });

        btnContainer.appendChild(updateBtn);
        btnContainer.appendChild(deleteBtn);
        img.src = URL.createObjectURL(file);
        return file;
      }

      return currentFile;
    });

    dataTransfer.items.clear();
    for (let i = 0; i < updatedFiles.length; i++) {
      dataTransfer.items.add(updatedFiles[i]);
    }
    fileInput.files = dataTransfer.files;
  } else {
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;

    paintPreview(file, randomId);
  }
};

const init = () => {
  if (originalPreviews.length > 0) {
    window.addEventListener("load", handleOriginalPreviews);
  }

  fileInput.addEventListener("change", handleChange);

  fakeFileBtn.addEventListener("click", () => fileInput.click());
};

init();
