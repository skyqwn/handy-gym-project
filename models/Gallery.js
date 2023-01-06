import mongoose from "mongoose";

const GallerySchema = mongoose.Schema(
  {
    title: String,
    description: String,
    photos: [String],
    creator: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.model("Gallery", GallerySchema);

export default Gallery;
