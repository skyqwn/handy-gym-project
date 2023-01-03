import mongoose from "mongoose";

const GallerySchema = mongoose.Schema(
  {
    title: String,
    photo: [String],
    creator: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.model("Gallery", GallerySchema);

export default Gallery;
