const fileInput = document.querySelector("input[name=photos]");
const preview = document.getElementById("preview");
const fakeFileBtn = document.getElementById("fakeFileBtn");

const dataTransfer = new DataTransfer();

const MAX_FILE = 6;

// data transfer 핸들함수

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

  const compressedUrl = URL.createObjectURL(imgSrc);
  previewImg.src = compressedUrl;

  previewContainer.classList.add("previewContainer");
  previewImg.classList.add("previewContainer__img");
  deleteBtn.classList.add("previewContainer__btn");

  previewContainer.appendChild(previewImg);
  previewContainer.appendChild(deleteBtn);

  preview.append(previewContainer);
};

const handleChange = async (event) => {
  const imgFiles = event.target.files;

  const compressOption = {
    maxSizeMB: 1,
    maxWidthOrHeight: 760,
    initialQuality: 0.8,
    useWebWorker: false,
  };

  const compressFile = async (file) => {
    try {
      if (dataTransfer.files.length >= MAX_FILE) {
        return;
      }

      const randomId = Math.random().toString(16).slice(2);

      let compressedBlob = await imageCompression(file, compressOption);
      compressedBlob.name = `${file.name}_compressed`;

      const compressedFile = new File([compressedBlob], compressedBlob.name, {
        type: "images/*",
      });

      paintPreview(compressedFile, randomId);
      compressedFile.id = randomId;

      dataTransfer.items.add(compressedFile);
      saveFiles();
    } catch (error) {
      console.log(error);
      alert("파일 올리는 도중 오류발생");
      return;
    }
  };

  for (let i = 0; i < imgFiles.length; i++) {
    await compressFile(imgFiles[i]);
  }

  if (dataTransfer.files.length >= MAX_FILE) {
    alert(`최대 ${MAX_FILE}장까지 업로드 가능합니다`);
  }
};

fileInput.addEventListener("change", handleChange);
fakeFileBtn.addEventListener("click", () => fileInput.click());
