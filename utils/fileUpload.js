import multer from "multer";

export const gymUpload = multer({ dest: "uploads/gym" });

export const galleryUpload = multer({ dest: "uploads/gallery" });
