import mongoose from "mongoose";

const GallerySchema = mongoose.Schema(
  {
    title: String,
    photos: [
      {
        photo: String,
        caption: String,
      },
    ],
    creator: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    views: { type: Number, default: 0 },
    comments: [String],
    like_users: [String],
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.model("Gallery", GallerySchema);

export default Gallery;
