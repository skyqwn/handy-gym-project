import multer from "multer";
import dotenv from "dotenv";
dotenv.config();
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS,
    secretAccessKey: process.env.AWS_S3_SCERET,
  },
  region: process.env.AWS_S3_REGION,
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

export const s3AvatarUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, `avatar/${Date.now()}_${file.originalname}`);
    },
  }),
});
export const s3GymUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, `gym/${Date.now()}_${file.originalname}`);
    },
  }),
});
export const s3GalleryUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, `gallery/${Date.now()}_${file.originalname}`);
    },
  }),
});

// export const gymUpload = multer({ dest: "uploads/gym" });
// export const galleryUpload = multer({ dest: "uploads/gallery" });
// export const avatarUpload = multer({ dest: "uploads/avatar" });
