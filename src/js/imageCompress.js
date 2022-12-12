const fileInput = document.querySelector("input[type=file]");
const dataTransfer = new DataTransfer();
const preview = document.getElementById("preview");
const fakeFileBtn = document.getElementById("fakeFileBtn");

const saveFiles = () => {
  fileInput.files = dataTransfer.files;
};

const deletePreview = (id) => {
  const container = document.getElementById(id);
  container.remove();
  const findIndexById = [...dataTransfer.files].findIndex(
    (file) => file.id === id
  );
  dataTransfer.items.remove(findIndexById);
  saveFiles();
};

const paintPreview = (imgSrc, id) => {
  const previewContainer = document.createElement("div");
  previewContainer.id = id;
  const previewImg = document.createElement("img");

  const deleteBtn = document.createElement("div");
  deleteBtn.innerHTML = `<i class="fa-solid fa-circle-xmark"></i>`;
  deleteBtn.addEventListener("click", () => {
    deletePreview(id);
  });

  const compressedUrl = window.URL.createObjectURL(imgSrc);
  previewImg.src = compressedUrl;

  previewContainer.classList.add("previewContainer");
  previewImg.classList.add("previewContainer__img");
  deleteBtn.classList.add("previewContainer__btn");

  previewContainer.append(deleteBtn);
  previewContainer.append(previewImg);
  preview.appendChild(previewContainer);
};

const handleImageUpload = async (event) => {
  const imageFiles = event.target.files;

  const compressOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 760,
    initalQuality: 0.8,
    useWebWorker: false,
  };

  const compressFile = async (file) => {
    try {
      if (dataTransfer.files.length >= 6) {
        return;
      }
      const randomId = Math.random().toString(16).slice(2);

      let compressedBlob = await imageCompression(file, compressOptions);
      compressedBlob.name = `${file.name}_compressed`;

      const compressedFile = new File([compressedBlob], compressedBlob.name, {
        type: "image/*",
      });

      compressedFile.id = randomId;

      paintPreview(compressedFile, randomId);

      dataTransfer.items.add(compressedFile);
      saveFiles();
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

fileInput.addEventListener("change", handleImageUpload);

fakeFileBtn.addEventListener("click", () => fileInput.click());
