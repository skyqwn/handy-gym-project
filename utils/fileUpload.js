import multer from "multer";
import dotenv from "dotenv";
dotenv.config();
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_S3_ACCESS,
  secretAccessKey: process.env.AWS_S3_SCERET,
  region: process.env.AWS_S3_REGION,
});

export const S3MulterUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  }),
});

export const gymUpload = multer({ dest: "uploads/gym" });

export const galleryUpload = multer({ dest: "uploads/gallery" });

// export const avatarUpload = multer({ dest: "uploads/avatar" });
