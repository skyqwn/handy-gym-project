import mongoose from "mongoose";

const GymSchema = mongoose.Schema(
  {
    name: String,
    address: String,
    location: String,
    photos: [String],
    title: String,
    description: String,
    yearRound: String,
    oneday: String,
    onedayPay: String,
    creator: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    like_users: [String],
    // category: [String],
  },
  {
    timestamps: true,
  }
);

const Gym = mongoose.model("Gym", GymSchema);

export default Gym;
