// const body = document.querySelector("body");
// const modalContainer = document.querySelector(".modalContainer");
// const modalWrapper = document.querySelector(".modalWrapper");
// const cropperContainer = document.querySelector(".cropperContainer");
// const originalPreviews = document.querySelectorAll(".originalPreview");
// const originalCaptions = document.querySelectorAll(".originalCaption");

// const realFileInput = document.getElementById("realFileInput");
// const fakeFileInput = document.getElementById("fakeFileInput");
// const galleryPreview = document.getElementById("galleryPreview");
// const closeBtn = document.getElementById("closeBtn");

// let cropper;

// const dataTransfer = new DataTransfer();

// const generateRandomId = () => {
//   return Math.random().toString(16).slice(2);
// };
// const compressFile = async (file) => {
//   const compressOptions = {
//     maxSizeMB: 1,
//     maxWidthOrHeight: 1280,
//     initalQuality: 0.8,
//     useWebWorker: false,
//   };

//   try {
//     if (dataTransfer.files.length >= 6) {
//       return;
//     }

//     let blob = await imageCompression(file, compressOptions);
//     blob.name = `${file.name}_compressed`;
//     const convertFile = convertBlobToFile(blob);
//     return convertFile;
//   } catch (error) {
//     console.log(error);
//     return alert("이미지 압축중 오류");
//   }
// };

// const convertBlobToFile = (blob) => {
//   const convertFile = new File([blob], blob.name || "previews", {
//     type: "images/*",
//   });
//   return convertFile;
// };

// const cropImgToData = (blob, targetId, newId) => {
//   const convertFile = new File([blob], blob.name || "cropedImg", {
//     type: "images/*",
//   });
//   convertFile.id = newId;
//   const updatedFiles = Array.from(dataTransfer.files).map((dataFile) => {
//     if (dataFile.id === targetId) {
//       return convertFile;
//     }
//     return dataFile;
//   });

//   dataTransfer.items.clear();
//   for (let i = 0; i < updatedFiles.length; i++) {
//     dataTransfer.items.add(updatedFiles[i]);
//   }
//   realFileInput.files = dataTransfer.files;
// };

// const handleContainer = (e) => {
//   if (e.target === modalContainer || e.target === cropperContainer) {
//     closeModal();
//   }
// };

// const handleChange = async (e) => {
//   const file = e.target.files[0];

//   const preview = async (file) => {
//     const randomId = generateRandomId();

//     const compressedFile = await compressFile(file);

//     const data = { file: compressedFile, caption: "" };

//     paintPreview(randomId, data);

//     newImgToData(compressedFile, randomId);
//   };

//   preview(file);

//   // const file = await compressFile(imageFile);
//   // const previewContainer = document.createElement("div");

//   // previewContainer.id = randomId;
//   // previewContainer.classList.add("previewContainer");

//   // paintPreview(previewContainer, file, randomId, "");

//   // galleryPreview.append(previewContainer);

//   // newImgToData(file, randomId);
//   // for (let i = 0; i < imageFile.length; i++) {
//   // }
// };

// const openModal = () => {
//   modalContainer.style.transform = "translateY(0)";
//   modalWrapper.style.top = `${window.scrollY}px`;
//   body.style.overflowY = "hidden";
// };

// const openCrop = (imgSrc, targetId) => {
//   openModal();

//   cropperContainer.innerHTML = "";

//   const img = document.createElement("img");
//   img.src = imgSrc;

//   const cropSaveBtn = document.createElement("div");
//   cropSaveBtn.addEventListener("click", (e) => cropSave(e, targetId));
// };

// const cropSave = (e, id) => {
//   e.preventDefault();
//   cropper
//     .getCroppedCanvas({
//       minWidth: 256,
//       minHeight: 256,
//       maxWidth: 4096,
//       maxHeight: 4096,
//     })
//     .toBlob((blob) => {
//       const randomId = generateRandomId();

//       const croppedFile = convertBlobTOFile(blob);

//       const caption = findCaption(targetId);

//       const data = { file: blob, caption };

//       updatePreview(targetId, randomId, data);

//       updateImgToData(croppedFile, targetId, randomId);

//       closeModal();
//     });
// };

// const generateBtnContainer = (newId, blob) => {
//   const btnContainer = document.createElement("div");
//   btnContainer.classList.add("btnContainer");

//   const cropBtn = document.createElement("div");
//   cropBtn.innerText = "수정";
//   cropBtn.classList.add("cropBtn");
//   cropBtn.addEventListener("click", (e) => openCrop(blob, newId));

//   const changeBtn = document.createElement("div");
//   changeBtn.innerText = "파일변경";
//   changeBtn.classList.add("deleteBtn");
//   changeBtn.addEventListener("click", (e) => changeFile(newId));
// };

// const findCaption = (targetId) => {
//   const container = document.getElementById(targetId);
//   const textarea = container.querySelector("textarea");
//   const caption = textarea.value;
//   if (caption) {
//     return caption;
//   } else {
//     return "";
//   }
// };

// const updatePreview = (targetId, newId, data) => {
//   const container = document.getElementById(targetId);
//   container.innerHTML = "";
//   container.id = newId;

//   const blob = URL.createObjectURL(data.file);

//   const img = doucment.createELement("img");
//   img.src = blob;
//   img.classList.add("previewImg");

//   const btnContainer = generateBtnContainer(newId, blob);

//   const desc = document.createElement("textarea");
//   desc.name = "captions";
//   desc.placeholder = "사진에 대한 설명을 적어보세요. (선택사항)";
//   if (data.caption) desc.value = data.caption;

//   container.append(img);
//   container.append(btnContainer);
//   container.append(desc);
// };

// const changeFile = (id) => {
//   const input = document.createElement("input");
//   input.type = "file";
//   input.click();
//   input.addEventListener("change", async (e) => {
//     const randomId = generateRandomId();
//     const file = e.target.files[0];
//     const compressedFile = await compressFile(file);
//     const caption = findCaption(id);
//     const data = { file: compressedFile, caption };
//     updatePreview(id, randomId, data);
//     updateImgToData(compressedFile, id, randomId);
//   });
// };

// const paintPreview = (newId, data) => {
//   const container = document.createElement("div");
//   container.id = newId;
//   container.classList.add("previewContainer");

//   const blob = window.URL.createObjectURL(data.file);

//   const img = document.createElement("img");
//   img.src = data.blob;
//   img.classList.add("previewImg");

//   const btnContainer = generateBtnContainer(newId, blob);

//   const desc = document.createElement(newId, blob);
//   desc.name = "captions";
//   desc.placeholder = "사진에 대한 설명을 적어보세요. (선택사항)";
//   if (data.caption) desc.value = data.caption;

//   container.append(img);
//   container.append(btnContainer);
//   container.append(desc);

//   galleryPreview.append(container);
// };

// const newImgToData = (file, newId) => {
//   file.id = newId;
//   dataTransfer.items.add(file);
//   realFileInput.files = dataTransfer.files;
// };

// const deletePreview = (id) => {
//   const ok = confirm("정말 삭제하시겠습니가?");
//   if (ok) {
//     const container = document.getElementById(id);
//     container.remove();
//     deleteImgDate(id);
//   }
// };

// const deleteImgDate = (id) => {
//   const findIndexById = [...dataTransfer.files].findIndex(
//     (file) => file.id === id
//   );
//   dataTransfer.items.remove(findIndexById);
//   realFileInput.files = dataTransfer.files;
// };

// const init = () => {
//   fakeFileInput.addEventListener("change", handleChange);
//   const originalPhotos = document.querySelectorAll(".originalPhoto");
//   const originalCaptions = document.querySelector(".originalCaption");
//   if (originalPreviews.length > 0) {
//     const handleLoad = async () => {
//       const paintOriginalPreview = async (imgEle, captionEle) => {
//         let canvas = document.createElement("canvas");
//         canvas.width = imgEle.naturalWidth;
//         canvas.height = imgEle.naturalHeight;
//         let context = canvas.getContext("2d");
//         context.drawImage(imgEle, 0, 0);
//         try {
//           const randomId = generateRandomId();

//           const blob = await new Promise((resolve) =>
//             canvas.toBlob((blob) => resolve(blob))
//           );
//           const file = convertBlobToFile(blob);
//           file.id = randomId;

//           const captionValue = captionEle.value;

//           const data = { file, captionValue };

//           paintPreview(randomId, data);
//           newImgToData(file, randomId);
//         } catch {
//           console.log(error);
//           alert("미리보기 생성 중 오류발생");
//         }
//       };
//       for (let i = 0; originalPreviews.length > i; i++) {
//         await paintOriginalPreview(originalPreviews[i], originalCaptions[i]);
//       }
//     };
//     window.addEventListener("load", handleLoad);
//   }
//   cloaseBtn.addEventListener("click", closeModal);
// };

// init();
"use strict";