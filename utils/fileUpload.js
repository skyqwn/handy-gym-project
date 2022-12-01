import multer from "multer";

export const gymUpload = multer({ dest: "uploads/" });

export const postUpload = multer({ dest: "uploads/" });
