const fileInput = document.querySelector("input[name=photos]");
const preview = document.getElementById("preview");
const fakeFileBtn = document.getElementById("fakeFileBtn");
const originalPreviews = document.querySelectorAll(".originalPreview");

const MAX_FILE = 6;

const dataTransfer = new DataTransfer();

const startLoading = (ele) => {
  ele.innerHTML = "";
  if (ele.classList.contains("fa-pen")) {
    ele.classList.remove("fa-pen");
    ele.classList.add("fa-spinner");
    ele.classList.add("fa-spin-pulse");
    return;
  }
  ele.innerHTML = `<i class="fa-solid fa-spinner fa-spin-pulse"></i>`;
  ele.disable = true;
};

const endLoading = (ele) => {
  ele.innerHTML = "";
  ele.innerHTML = `<i class="fa-solid fa-plus"></i>`;
  ele.disable = false;
};

const handleChange = (event) => {
  const imgFiles = event.target.files;

  startLoading(fakeFileBtn);
};

const convertBlobToFile = (blob) => {
  const convertFile = new File([blob], blob.name || "preview", {
    type: "images/*",
  });
  return convertFile;
};

const generateBtns = (id) => {
  const deleteBtn = document.createElement("div");
  deleteBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  deleteBtn.addEventListener("click", (e) => {
    deletePreview(id);
  });
  const deletePreview = (id) => {
    const container = document.getElementById(id);
    container.remove();

    const findIndexById = [...dataTransfer.files].findIndex(
      (file) => file.id === id
    );

    dataTransfer.items.remove(findIndexById);

    fileInput.files = dataTransfer.files;
  };

  const updateBtn = document.createElement("div");
  updateBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
  updateBtn.addEventListener("click", (e) => {
    updatePreview(id, e.target);
  });
  const updatePreview = (id, btn) => {
    const input = document.createElement("input");
    input.type = "file";
    input.click();
    input.addEventListener("change", (e) => updateChange(e, id, btn));
  };
  return { deleteBtn, updateBtn };
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
  preview.classList.add("previewContainer__img");
  btnContainer.classList.add("previewContaienr__btn");

  const { deleteBtn, updateBtn } = generateBtns(id);

  btnContainer.appendChild(updateBtn);
  btnContainer.appendChild(deleteBtn);

  previewContainer.appendChild(previewImg);
  previewContainer.appendChild(btnContainer);

  preview.append(previewContainer);
};

const init = () => {
  fileInput.addEventListener("change", handleChange);
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
        } catch (error) {
          console.log(error);
          alert("미리보기 생성 중 오류발생");
        }
      };
    };
  }
};
