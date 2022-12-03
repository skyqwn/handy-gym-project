const fileInput = document.querySelector("input[type=file]");
const dataTransfer = new DataTransfer();

const handleImageUpload = (event) => {
  const imageFiles = event.target.files;

  const compressOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 760,
    initalQuality: 0.8,
    useWebWorker: false,
  };

  const compressFile = async (file) => {
    try {
      let compressedBlob = await imageCompression(file, compressOptions);
      compressedBlob.name = `${file.name}_compressed`;

      console.log(compressedBlob);

      const compressedFile = new File([compressedBlob], compressedBlob.name, {
        type: "image/*",
      });

      dataTransfer.items.add(compressedFile);
      fileInput.files = dataTransfer.files;
    } catch (error) {
      console.log(error);
      return alert("오류");
    }
  };

  for (let i = 0; i < imageFiles.length; i++) {
    compressFile(imageFiles[i]);
  }
};

fileInput.addEventListener("change", handleImageUpload);
