import mongoose, { SchemaType } from "mongoose";

const Schema = mongoose.Schema;

const GymSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  photo: [String],
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: [String],
});

const Gym = mongoose.model("Gym", GymSchema);

export default Gym;
