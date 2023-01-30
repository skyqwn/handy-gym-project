import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const UserSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  avatarUrl: String,
  password: String,
  email: { type: String, required: true },
  email_verified: { type: Boolean, default: false },
  email_verify_string: {
    type: String,
    default: uuidv4(),
  },
  socialId: Number,
  socialType: String,
});

const User = mongoose.model("User", UserSchema);
export default User;
