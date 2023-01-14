const fileInput = document.querySelector("input[name=avatar]");
const fakeFileInput = document.getElementById("fakeFileInput");

const avatarBtn = document.getElementById("fileBtn");
const deleteBtn = document.getElementById("deleteBtn");

const avatarImg = document.getElementById("jsAvatarImg");

let dataTransfer = new DataTransfer();

let noUserImgSrc = "";

const paintPreview = (file) => {
  const imgSrc = URL.createObjectURL(file);

  avatarImg.src = imgSrc;
};

const addFile = (file) => {
  dataTransfer.clearData();

  dataTransfer.items.add(file);

  fileInput.files = dataTransfer.files;
};

const removeFile = () => {
  dataTransfer.clearData();
  fileInput.files = dataTransfer.files;
};

const convertBlobToFile = (blob) => {
  const convertFile = new File([blob], blob.name || "preview", {
    type: "image/*",
  });

  return convertFile;
};

const compressFile = async (file) => {
  const compressOption = {
    maxSizeMB: 1,
    maxWidthOrHeight: 110,
    initialQuality: 0.9,
    useWebWorker: false,
  };
  try {
    let compressedBlob = await imageCompression(file, compressOption);
    compressedBlob.name = `${file.name}_compressed`;

    const convertFile = convertBlobToFile(compressedBlob);

    return convertFile;
  } catch (error) {
    console.log(error);
    alert("파일 업로드중 오류발생!");
    return;
  }
};

const imgSrcToFile = async (imageEle) => {
  const canvas = document.createElement("canvas");
  canvas.height = imageEle.naturalHeight;
  canvas.width = imageEle.naturalWidth;
  canvas.getContext("2d").drawImage(imageEle, 0, 0);
  try {
    const blob = await new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob))
    );
    return convertBlobToFile(blob);
  } catch (error) {
    console.log(error);
  }
};

const fakeHandleFile = async (e) => {
  const file = e.target.files[0];

  if (file) {
    const compressedFile = await compressFile(file);

    paintPreview(compressedFile);

    addFile(compressedFile);
  }
};

const init = () => {
  const originalImg = document.getElementById("originalImg");
  const noUserImg = document.getElementById("noUserImg");

  const handleLoad = async () => {
    avatarBtn.addEventListener("click", (e) => {
      fakeFileInput.click();
    });
    deleteBtn.addEventListener("click", (e) => {
      avatarImg.src = noUserImgSrc;

      removeFile();
    });

    fakeFileInput.addEventListener("change", fakeHandleFile);

    if (originalImg) {
      const originalImgFile = await imgSrcToFile(originalImg);
      addFile(originalImgFile);
    }
    const noUserImgFile = await imgSrcToFile(noUserImg);
    const noUserImgUrl = URL.createObjectURL(noUserImgFile);
    noUserImgSrc = noUserImgUrl;
  };
  window.addEventListener("load", handleLoad);
};

init();
