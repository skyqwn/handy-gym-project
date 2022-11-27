import mongoose from "mongoose";

const GymSchema = mongoose.Schema(
  {
    name: String,
    address: String,
    location: String,
    photos: [String],
    title: String,
    description: String,
    creator: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    category: [String],
  },
  {
    timestamp: true,
  }
);

const Gym = mongoose.model("Gym", GymSchema);

export default Gym;
