import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const UserSchema = new mongoose.Schema({
  nickname: String,
  avatarUrl: String,
  password: String,
  email: String,
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
